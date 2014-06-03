// author: Peter
// version: 1.0
// date: 1/15/2014
// description: Large flow marking using OmniSwitch

// based on article:
// http://blog.sflow.com/2014/01/large-flow-marking-using-hybrid-openflow.html

include('extras/aluws.js');

var flowkeys = 'ipsource,ipdestination';
var value = 'bytes';
var filter = 'direction=ingress';

var trigger = 100000;
var release = 100;

var tos = '0x4';

var metricName = 'mark';
var id = 0;
var controls = {};
var enabled = true;

var user = 'admin';
var password = 'password';
var sampling = 128;
var polling = 30;

var collectorIP = "10.0.0.162";
var collectorPort = 6343;

// Floodlight OpenFlow Controller REST API
var floodlight = 'http://10.0.0.53:8080/';
var listswitches = floodlight+'wm/core/controller/switches/json';
var flowpusher = floodlight+'wm/staticflowentrypusher/json';
var clearflows = floodlight+'wm/staticflowentrypusher/clear/all/json'; 

function clearOpenFlow() {
  http(clearflows);
}

function setOpenFlow(spec) {
  http(flowpusher, 'post','application/json',JSON.stringify(spec));
}

function deleteOpenFlow(spec) {
  http(flowpusher, 'delete','application/json',JSON.stringify(spec));
}

var agents = {};
function discoverAgents() {
    var res = http(listswitches);
    var dps = JSON.parse(res);
    for(var i = 0; i < dps.length; i++) {
      var dp = dps[i];
      var agent = dp.inetAddress.match(/\/(.*):/)[1];
      var ports = dp.ports;
      var nameToNumber = {};
      var names = [];
      // get ifName to OpenFlow port number mapping
      // and list of OpenFlow enabled ports
      for (var j = 0; j < dp.ports.length; j++) {
         var port = dp.ports[j];
         var name = port.name.match(/^port (.*)$/)[1];
         names.push(name);
         nameToNumber[name] = port.portNumber;
      }
      agents[agent] = {dpid:dp.dpid,names:names,nameToNumber:nameToNumber}; 
    }
}

function initializeAgent(agent) {
    var rec = agents[agent];
    var server = new ALUServer(agent,user,password);
    rec.server = server;

    var ports = rec.names.join(' ');

    server.login();

    // configure sFlow
    server.runCmds([
      'sflow agent ip ' + agent,
      'sflow receiver 1 name InMon address '+collectorIP+' udp-port '+collectorPort,
      'sflow sampler 1 port '+ports+' receiver 1 rate '+sampling,
      'sflow poller 1 port '+ports+' receiver 1 interval '+polling
    ]);

    // get ifIndex to ifName mapping
    var res = server.rest('get','mib','ifXTable',{mibObject0:'ifName'});
    var rows = res.result.data.rows;
    var ifIndexToName = {};
    for(var ifIndex in rows) ifIndexToName[ifIndex] = rows[ifIndex].ifName;

    server.logout();

    agents[agent].ifIndexToName = ifIndexToName;
}

function mark(agent,dataSource,flowkey) {
    if(controls[flowkey]) return;

    var rec = agents[agent];
    if(!rec) return;

    var name = 'ctl' + id++;
    var parts = flowkey.split(',');
    setOpenFlow({name:name,switch:rec.dpid,cookie:0,
                 priority:500,active:true,
		 'ether-type':'0x0800','src-ip':parts[0],'dst-ip':parts[1],
                 actions:'set-tos-bits='+tos+',output=normal'});

    controls[flowkey] = { 
	name: name, 
	agent:agent,
        dataSource:dataSource,
	action:'mark', 
	time: (new Date()).getTime() 
    };
}

function unmark(flowkey) {
    if(!controls[flowkey]) return;

    deleteOpenFlow({name:controls[flowkey].name});

    delete controls[flowkey];
}

setEventHandler(function(evt) {
	if(!enabled) return;

	mark(evt.agent,evt.dataSource,evt.flowKey);
}, [metricName]);


setIntervalHandler(function() {
  // remove controls when flow below release threshold
  var stale = [];
  for(var flowkey in controls) {
    var ctl = controls[flowkey];
    var val = flowvalue(ctl.agent,ctl.dataSource+'.'+metricName,flowkey);
    if(!val || val <= release) stale.push(flowkey);
  }
  for(var i = 0; i < stale.length; i++) unmark(stale[i]);
},5);


setHttpHandler(function(request) {
	var result = {};
	try {
	    var action = '' + request.query.action;
	    switch(action) {
	    case 'enable':
		enabled = true;
		break;
	    case 'disable':
		enabled = false;
		break;
            case 'clear':
                clearOpenFlow();
		controls = {};
                break;
	    }
	}
	catch(e) { result.error = e.message }
	result.controls = controls;
	result.enabled = enabled;
	return JSON.stringify(result);
});

discoverAgents();
for(var agent in agents) {
    initializeAgent(agent);
}

setFlow(metricName,{keys:flowkeys,value:value,filter:filter});
setThreshold(metricName,{metric:metricName,value:trigger,byFlow:true,timeout:10});

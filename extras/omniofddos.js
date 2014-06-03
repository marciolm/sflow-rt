// author: Peter
// version: 1.0
// date: 1/11/2014
// description: DDoS mitigation using OmniSwitch/OpenFlow

// based on article:
// http://blog.sflow.com/2014/01/physical-switch-hybrid-openflow-example.html

include('extras/aluws.js');

var flowkeys = 'inputifindex,ipsource';
var value = 'frames';
var filter = 'direction=ingress&icmptype=8';
var threshold = 1000;

var metricName = 'ddos';
var controls = {};
var enabled = true;
var blockSeconds = 20;

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

function block(agent,ip,port) {
    if(controls[ip]) return;

    var rec = agents[agent];
    if(!rec) return;

    var name = 'block-' + ip;
    setOpenFlow({name:name,switch:rec.dpid,cookie:0,
                 priority:500,active:true,
                 'ether-type':'0x0800','src-ip':ip,
                 actions:''});

    controls[ip] = { 
	name: name, 
	agent:agent,
	action:'block', 
	time: (new Date()).getTime() 
    };
}

function allow(ip) {
    if(!controls[ip]) return;

    deleteOpenFlow({name:controls[ip].name});

    delete controls[ip];
}

setEventHandler(function(evt) {
	if(!enabled) return;

	var agent = evt.agent;
	var parts = evt.flowKey.split(',');
	var ifindex = parts[0];
	var ipsource = parts[1];

	var rec = agents[agent];
	if(!rec) return;

	block(agent,ipsource,rec.ifIndexToName[ifindex]);
}, [metricName]);


setIntervalHandler(function() {
  // remove stale controls
  var stale = [];
  var now = (new Date()).getTime();
  var threshMs = 1000 * blockSeconds;
  for(var addr in controls) {
    if((now - controls[addr].time) > threshMs) stale.push(addr);
  }
  for(var i = 0; i < stale.length; i++) allow(stale[i]);
},10);


setHttpHandler(function(request) {
	var result = {};
	try {
	    var action = '' + request.query.action;
	    switch(action) {
	    case 'block':
		var agent = request.query.agent[0];
		var address = request.query.address[0];
		var port = request.query.port[0];
		if(agent&&address&&port) block(agent,address,port);
		break;
	    case 'allow':
		var address = request.query.address[0];
		if(address) allow(address);
		break;
	    case 'enable':
		enabled = true;
		break;
	    case 'disable':
		enabled = false;
		break;
            case 'clearof':
                clearOpenFlow();
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
setThreshold(metricName,{metric:metricName,value:threshold,byFlow:true,timeout:10});

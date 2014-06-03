// author: Peter
// version: 1.0
// date: 1/9/2014
// description: DDoS mitigation using OmniSwitch

// based on article:
// http://blog.sflow.com/2014/01/alcatel-lucent-omniswitch-analytics.html

include('extras/aluws.js');

var flowkeys = 'inputifindex,ipsource';
var value = 'frames';
var filter = 'direction=ingress&icmptype=8';
var threshold = 1000;

var metricName = 'ddos';
var controls = {};
var enabled = true;
var blockSeconds = 20;
var ruleid = 0;

var collectorIP = "10.0.0.162";
var collectorPort = 6343;

var agents = {
    '10.0.0.234':{user:'admin',password:'password',ports:'1/1-20',sampling:128, polling:20}
}

function initializeAgent(agent) {
    var rec = agents[agent];
    var server = new ALUServer(agent,rec.user,rec.password);
    rec.server = server;

    server.login();

    // configure sFlow
    server.runCmds([
      'sflow agent ip ' + agent,
      'sflow receiver 1 name InMon address '+collectorIP+' udp-port '+collectorPort,
      'sflow sampler 1 port '+rec.ports +' receiver 1 rate '+rec.sampling,
      'sflow poller 1 port '+rec.ports +' receiver 1 interval '+rec.polling
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

    var name = 'rt' + ruleid++;

    rec.server.login();

    rec.server.runCmds([
      'policy condition '+name+' source ip '+ip,
      'policy action '+name+' disposition drop',
      'policy rule '+name+' condition '+name+' action '+name,
      'qos apply'
    ]);

    rec.server.logout();

    controls[ip] = { 
	name: name, 
	agent:agent,
	action:'block', 
	time: (new Date()).getTime() 
    };
}

function allow(ip) {
    if(!controls[ip]) return;

    var ctl = controls[ip];
    var agent = ctl.agent;
    var rec = agents[agent];

    rec.server.login();

    rec.server.runCmds([
      'no policy rule '+ctl.name,
      'no policy action '+ctl.name,
      'no policy condition '+ctl.name,
      'qos apply'
   ]);

    rec.server.logout();

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
	    }
	}
	catch(e) { result.error = e.message }
	result.controls = controls;
	result.enabled = enabled;
	return JSON.stringify(result);
});

setFlow(metricName,{keys:flowkeys,value:value,filter:filter});
setThreshold(metricName,{metric:metricName,value:threshold,byFlow:true,timeout:10});

for(var agent in agents) {
    initializeAgent(agent);
}

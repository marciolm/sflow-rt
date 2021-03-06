// based on article:
// http://blog.sflow.com/2013/08/frenetic-pyretic-and-resonance.html

var http = require('http');
var exec = require('child_process').exec;

var keys = 'ipsource';
var value = 'frames';
var filter = 'outputifindex!=discard&direction=ingress';
var thresholdValue = 4;
var metricName = 'ddos';

var rt = { hostname: 'localhost', port: 8008 };
var flows = {'keys':keys,'value':value,'filter':filter, t:2};
var threshold = {'metric':metricName,'value':thresholdValue, byFlow:true};

function extend(destination, source) {
  for (var property in source) {
    if (source.hasOwnProperty(property)) {
      destination[property] = source[property];
    }
  }
  return destination;
}

function jsonGet(target,path,callback) {
  var options = extend({method:'GET',path:path},target);
  var req = http.request(options,function(resp) {
    var chunks = [];
    resp.on('data', function(chunk) { chunks.push(chunk); });
    resp.on('end', function() { callback(JSON.parse(chunks.join(''))); });
  });
  req.end();
};

function jsonPut(target,path,value,callback) {
  var options = extend({method:'PUT',headers:{'content-type':'application/json'},path:path},target);
  var req = http.request(options,function(resp) {
    var chunks = [];
    resp.on('data', function(chunk) { chunks.push(chunk); });
    resp.on('end', function() { callback(chunks.join('')); });
  });
  req.write(JSON.stringify(value));
  req.end();
};

function sendy(address,type,state) {
  function callback(error, stdout, stderr) { };
    exec("../pyretic/pyretic/pyresonance/json_sender.py --flow='{srcip=" 
        + address + "}' -e " + type + " -s " + state + " -a 127.0.0.1 -p 50003", callback);  
//    exec("../pyretic/pyretic/pyresonance/json_sender.py --flow='{srcip=10.0.0.1}' -e ids -s infected -a 127.0.0.1 -p 50002", callback);
}

function getEvents(id) {
  jsonGet(rt,'/events/json?maxEvents=10&timeout=60&eventID='+ id,
    function(events) {
      var nextID = id;
      console.log("Run:" + (new Date()).getTime());
      console.log("Length:" + events.length);
      if(events.length > 0) {
        nextID = events[0].eventID;
	console.log("EventID:" + nextID);
        events.reverse();
        var now = (new Date()).getTime();
	console.log("Timestamp:" + now);
        for(var i = 0; i < events.length; i++) {
          var evt = events[i];
          var dt = now - evt.timestamp;
          if(metricName == evt.thresholdID  //ddos
            && Math.abs(dt) < 5000) {   // 5s 
            var flowKey = evt.flowKey;  //IP address
            sendy(flowKey,"ids","attack"); //IP,ids,attack
          }
        }
      }
      getEvents(nextID);
    }
  );
}

function setFlows() {
  jsonPut(rt,'/flow/' + metricName + '/json',
    flows,
    function() { setThreshold(); }
  );
}

function setThreshold() {
  jsonPut(rt,'/threshold/' + metricName + '/json',
    threshold,
    function() { getEvents(-1); }
  ); 
}

function initialize() {
  setFlows();
}

initialize();

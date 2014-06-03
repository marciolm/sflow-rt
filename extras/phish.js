// author: Peter
// version: 1.1
// date: 12/21/2013
// description: PhishTank blacklist checking

// based on article:
// http://blog.sflow.com/2013/12/blacklists.html
// modified to support named groups

include('extras/json2.js');

var server = '10.0.0.1';
var port = 514;
var facility = 16; // local0
var severity = 5;  // notice

var domains = {};
function updatePhish() {
  var phish = JSON.parse(http("http://data.phishtank.com/data/online-valid.json"));
  domains = {};
  var dlist = [];
  var groups = {};
  for(var i = 0; i < phish.length; i++) {
    var entry = phish[i];
    var target = entry.target;
    var id = entry.phish_id;
    var url = entry.url;
    var dnsqname = url.match(/:\/\/(.[^/]+)/)[1] + '.';
    if(!domains[dnsqname]) {
      domains[dnsqname] = id;
      dlist.push(dnsqname);
    }
    var details = entry.details;
    var cidrlist = [];
    for(var j = 0; j < details.length; j++) {
      var ip = details[j].ip_address;
      var cidr = details[j].cidr_block;
      if(cidr) cidrlist.push(cidr);
    }
    if(cidrlist.length > 0) groups[id] = cidrlist;
  }

  setGroups('phish',groups);

  setFlow('phishydns',
    {
      keys:'ipsource,ipdestination,dnsqname,dnsqr',
      value:'frames',
      filter:'dnsqname="'+ dlist + '"',
      log:true,
      flowStart:true
    }
  );
}

setFlowHandler(function(rec) {
  var keys = rec.flowKeys.split(',');
  var msg = {type:'phishing'};
  switch(rec.name) {
  case 'phishysrc':
     msg.victim=keys[0];
     msg.match='cidr';
     msg.phish_id = keys[1];
     break;
  case 'phishydst':
     msg.victim=keys[0];
     msg.match='cidr';
     msg.phish_id = keys[1];
     break;
  case 'phishydns':
     var id = domains[keys[2]];
     msg.victim = keys[3] == 'false' ? keys[0] : keys[1];
     msg.match = 'dns';
     msg.phish_id = domains[keys[2]];
     break;
  }
  syslog(server,port,facility,severity,msg);
},['phishysrc','phishydst','phishydns']);


try { updatePhish(); } catch(e) { logWarning(e); }

// update threat database every 24 hours
setIntervalHandler(function() {
  try { updatePhish(); } catch(e) { logWarning(e); }
},60*60*24);

setFlow('phishysrc',
  {
    keys:'ipsource,group:ipdestination:phish',
    value:'frames',
    log:true,
    flowStart:true
  }
);

setFlow('phishydest',
  {
    keys:'ipdestination,group:ipsource:phish',
    value:'frames',
    log:true,
    flowStart:true
  }
);


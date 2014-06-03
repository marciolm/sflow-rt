// author: Peter
// version: 1.1
// date: 12/20/2013
// description: Alcatel-Lucent OmniSwitch REST API
// var server = new ALUServer('10.0.0.234','user','password');
// server.login();
// server.rest('get','info','vlanTable');
// server.logout();

include('extras/json2.js');

function ALUServer(agent,usr,passwd) {
    this.agent = agent;
    this.usr = usr;
    this.passwd = passwd;
    this.accept = 'application/vnd.alcatellucentaos+json';

    this.login = function() {
	var resp = http('https://'+agent+'/auth/?username='+encodeURIComponent(usr)+'&password='+encodeURIComponent(passwd),'GET',null,null,this.accept);
	return JSON.parse(resp);
    }

    this.logout = function() {
	var resp = http('https://'+agent+'/auth/?','GET',null,null,this.accept);
	return JSON.parse(resp);
    }

    this.rest = function(method,domain,urn,query) {
	var url = 'https://'+this.agent+'/'+domain+'/'+urn +'?';
	if(query) {
	    if(typeof query == 'string') url += query;
	    else {
		var args = [];
		for(var key in query) {
		    if (query.hasOwnProperty(key)) {
			args.push(encodeURIComponent(key) + "=" + encodeURIComponent(query[key]));
		    }
		}
		url +=  args.join('&');
	    }
	}
	var resp;
	if('get' == method.toLowerCase()) resp = http(url,method,null,null,this.accept);
	else resp = http(url,method,null,null,null,null,this.accept);
	return JSON.parse(resp);
    }

    this.runCmds = function(cmds) {
	var results = [];
	for(var i = 0; i < cmds.length; i++) {
	    results.push(this.rest('get','cli','aos',{cmd:cmds[i]}));
	}
	return results;
    }
}


// author: Peter
// version: 1.1
// date: 5/6/2014
// description: Arista eAPI runCmds
// var s = new RpcServer('http://192.168.56.201/command-api','usr','passwd');
// var result = s.runCmds(["show version"]);

include('extras/jsonrpc.js');

RpcServer.prototype.runCmds = function(cmds) {
  try { return this.call('runCmds',{version:1,format:'json',cmds:cmds}); }
  catch(e) { throw e.message }
}

// author: InMon
// version: 1.0
// date: 12/12/2013
// description: Startup settings

setGroups('default',
{
  external:['0.0.0.0/0','::/0'],
  private:['10.0.0.0/8','172.16.0.0/12','192.168.0.0/16','FC00::/7'],
  multicast:['224.0.0.0/4']
});
setFlow('flows',{keys:'ipsource,ipdestination,stack',value:'bytes',log:true});
setThreshold('flows',{metric:'flows',value:1000000});

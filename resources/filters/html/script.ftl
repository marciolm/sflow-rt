<#include "resources/filters/header.ftl"/>
<div id="content">
<table>
<thead>
<tr><th>Function</th><th>Description</th></tr>
</thead>
<tr class="even">
  <td>version()</td>
  <td>GET /version</td>
</tr>
<tr class="odd">
  <td>analyzer()</td>
  <td>GET /analyzer/json</td>
</tr>
<tr class="even">
  <td>agents()</td>
  <td>GET /agents/json</td>
</tr>
<tr class="odd">
  <td>agents([addr1,addr2...])</td>
  <td>GET /agents/json?agent=addr1&amp;agent=addr2</td>
</tr>
<tr class="even">
  <td>metrics()</td>
  <td>GET /metrics/json</td>
</tr>
<tr class="odd">
  <td>metrics(agent)</td>
  <td>GET /metric/{agent}/json</td>
</tr>
<tr class="even">
  <td>metric(agent,metric&lt;,filter&gt;)</td>
  <td>GET /metric/{agent}/{metric}/json?filter</td>
</tr>
<tr class="odd">
  <td>dump(agent,metric&lt;,filter&gt;)</td>
  <td>GET /dump/{agent}/{metric}/json?filter</td>
</tr>
<tr class="even">
  <td>flowKeys()</td>
  <td>GET /flowkeys/json</td>
</tr>
<tr class="odd">
   <td>activeFlows(agent,name,&lt;maxFlows&lt;,minValue&lt;,aggMode&gt;&gt;&gt;)</td>
   <td>GET /activeflows/agent/{name}/json</td>
</tr>
<tr class="even">
   <td>flowValue(agent,name,key)</td>
   <td>GET /flowvalue/{agent}/{name}/json</td>
</tr>
<tr class="odd">
  <td>setFlow(name,spec)</td>
  <td>PUT /flow/{name}/json</td>
</tr>
<tr class="even">
  <td>clearFlow(name)</td>
  <td>DELETE /flow/{name}/json</td>
</tr>
<tr class="odd">
  <td>setThreshold(name,spec)</td>
  <td>PUT /threshold/{name}/json</td>
</tr>
<tr class="even">
  <td>clearThreshold(name)</td>
  <td>DELETE /threshold/{name}/json</td>
</tr>
<tr class="odd">
  <td>setFlowHandler(function(flowrec)&lt;,[name1,name2..]&gt;)</td>
  <td>GET /flows/json</td>
</tr>
<tr class="even">
  <td>clearFlowHandler()</td>
  <td></td>
</tr>
<tr class="odd">
  <td>setEventHandler(function(event)&lt;,[eventID1,eventID2..]&gt;)</td>
  <td>GET /events/json</td>
</tr>
<tr class="even">
  <td>clearEventHandler()</td>
  <td></td>
</tr>
<tr class="odd">
   <td>setIntervalHandler(function()&lt,seconds&gt;)</td>
   <td>Calls the function at regular intervals specified by <i>seconds</i> (default value is 1, i.e. every second)</td>
</tr>
<tr class="even">
   <td>clearIntervalHandler()</td>
   <td></td>
</tr>
<tr class="odd">
   <td>setHttpHandler(function(request))</td>
   <td>GET,POST,PUT,DELETE /script/name/json. The request object has the following format: {method:'GET'|'POST'|'PUT'|'DELETE', query:{key:[val1,val2..],..}, body:string}.  The function should return a JSON encoded object, e.g. <i>return JSON.stringify(result)</i>. Use <i>include('extras/json2.js')</i> to load the JSON library.</td>
</tr>
<tr class="even">
   <td>clearHttpHandler()</td>
   <td></td>
</tr>
<tr class="odd">
   <td>setGroups(name,spec)</td>
   <td>PUT /group/{name}/json</td>
</tr>
<tr class="even">
   <td>include(file)</td>
   <td>Include javascript file</td>
</tr>
<tr class="odd">
   <td>logFine(string)</td>
   <td>log FINE level message, see <a href="http://docs.oracle.com/javase/6/docs/api/java/util/logging/Logger.html">Logger.fine()</a></td>
</tr>
<tr class="even">
   <td>logInfo(string)</td>
   <td>log INFO level message, see <a href="http://docs.oracle.com/javase/6/docs/api/java/util/logging/Logger.html">Logger.info()</a></td>
</tr>
<tr class="odd">
   <td>logWarning(string)</td>
   <td>log WARNING level message, see <a href="http://docs.oracle.com/javase/6/docs/api/java/util/logging/Logger.html">Logger.warning()</a></td>
</tr>
<tr class="even">
   <td>logSevere(string)</td>
   <td>log SEVERE level message, see <a href="http://docs.oracle.com/javase/6/docs/api/java/util/logging/Logger.html">Logger.severe()</a></td>
</tr>
<tr class="odd">
   <td>string=formatDate(date,formatString&lt,language&lt,country&gt;&gt;)</td>
   <td>Format a JavaScript Date object, see <a href="http://docs.oracle.com/javase/6/docs/api/java/text/SimpleDateFormat.html">formatString</a>, <a href="http://docs.oracle.com/javase/6/docs/api/java/util/Locale.html">language</a> and <a href="http://docs.oracle.com/javase/6/docs/api/java/util/Locale.html">country</a>.</td>
</tr>
<tr class="even">
   <td>string=formatNumber(number,formatString&lt;,language&lt;,country&gt;&gt;)</td>
   <td>Format a JavaScript number,  see <a href="http://docs.oracle.com/javase/6/docs/api/java/text/DecimalFormat.html">formatString</a>, <a href="http://docs.oracle.com/javase/6/docs/api/java/util/Locale.html">language</a> and <a href="http://docs.oracle.com/javase/6/docs/api/java/util/Locale.html">country</a>.</td>
</tr>
<tr class="odd">
   <td>result=runCmd(cmd[]&lt;,envp[]&lt;dir&gt;&gt;)</td>
   <td>See <a href="http://docs.oracle.com/javase/6/docs/api/java/lang/Runtime.html">Java Runtine.exec</a><br/><i>result.status</i> the integer status code<br/><i>result.stdout</i> an array of strings containing lines of output from command<br/><i>result.stderr</i> an array of strings containing lines of error message from the command</td>
</tr>
<tr class="even">
   <td>http(url)<br/>
http(url,'get'&lt;,user,password&lt;,accept&gt;&gt;)<br/>
http(url,'put'|'post'|'delete',contentType,content&lt;,user,password&lt;,accept&gt;&gt;)</br>
http2({url:,operation:,body:,user:,password:,headers:{}})</td>
   <td>Interact with remote entities using HTTP protocol</td>
</tr>
<tr class="odd">
   <td>string = storeGet(key)</td>
   <td>Get value from persistent store</td>
</tr>
<tr class="even">
    <td>storeSet(key,value)</td>
    <td>Save value in persistent store</td>
</tr>
<tr class="odd">
    <td>storeDelete(key)</td>
    <td>Delete value from persistent store</td>
</tr>
<tr class="even">
    <td>array = storeKeys()</td>
    <td>Returns list of keys from persistent store</td>
</tr>
<tr class="odd">
    <td>string=md5(string)</td>
    <td>Calculate md5 hash of string</td>
</tr>
<tr class="even">
   <td>graphite(server,port|null,metrics)</td>
   <td>Send a set of metrics to specified <a href="http://graphite.wikidot.com/">Graphite</a> server using text protocol over TCP. Default <i>port</i> is 2003 and <i>metrics</i> is an object containing name,value pairs, e.g. {metric1:100,metric2:0.12}. Periodic metrics are typicall sent within the intervalHandler function.</td>
</tr>
<tr class="odd">
   <td>syslog(server,port|null,facility|null,severity|null,params)</td>
   <td>Send an event to a specified syslog server over UDP. Default <i>port</i> is 514, default <i>facility</i> is 16 (local0), default severity is <i>5</i> (Notice), and <i>params</i> contains name/value pairs, e.g. {source:"10.0.0.1",frameRate:1000}</td>
</tr>
<tr class="even">
   <td>setForward(name,address&lt;port&gt;)</td>
   <td>PUT /forwarding/{name}/json</td>
</tr>
<tr class="odd">
   <td>clearForward(name)</td>
   <td>DELETE /forwarding/{name}/json</td>
</tr>
<tr class="even">
   <td>ofSwitch([dpid, ...])</td>
   <td>GET /of/switch/{dpid}/json</td>
</tr>
<tr class="odd">
   <td>getOfRule(dpid, name)</td>
   <td>GET /of/rule/{dpid}/{name}/json</td>
</tr>
<tr class="even">
   <td>setOfRule(dpid, name, rule)</td>
   <td>PUT /of/rule/{dpid}/{name}/json</td>
</tr>
<tr class="odd">
   <td>deleteOfRule(dpid, name)</td>
   <td>DELETE /of/rule/{dpid}/{name}/json</td>
</tr>
<tr class="even">
   <td>array = ofInterfaceToPort(agent&lt;,ifindex&gt;)</td>
   <td>Find OpenFlow datapath,port pairs for sFlow agent and ifIndex</td>
</tr>
<tr class="odd">
   <td>array = ofIfNamePort(agent&lt;,ifname&gt;)</td>
   <td>Find OpenFlow datapath,port pairs for sFlow agent and ifName</td>
</tr>
<tr class="even">
   <td>setTopology(spec)</td>
   <td>PUT /topology/json</td>
</tr>
<tr class="odd">
    <td>getTopology()</td>
    <td>GET /topology/json</td>
</tr>
<tr class="even">
     <td>number = topologyVersion()</td>
     <td>Returns version number associated with current topology</td>
</tr>
<tr class="odd">
      <td>array = topologyLinkNames()</td>
      <td>Returns link names</td>
</tr>
<tr class="even">
      <td>array = topologyNodeNames()</td>
      <td>Returns node names</td>
</tr>
<tr class="odd">
      <td>link = topologyLink(name)</td>
      <td>Get link</td>
</tr>
<tr class="even">
       <td>node = topologyNode(name)</td>
       <td>Get node</td>
</tr>
<tr class="odd">
      <td>number = topologyDiameter()</td>
      <td>Calculate graph diameter</td>
</tr>
<tr class="even">
      <td>array = topologyShortestPath(name1,name2)</td>
      <td>Calculate shortest path between node name1 and node name2</td>
</tr>
<tr class="odd">
      <td>array = topologyShortestPaths(name1,name2,k,&lt;,n&gt;)</td>
      <td>Calculate k shortest paths with an optional path length limit of n</td>
</tr>
<tr class="even">
      <td>array = topologyMinimumSpanningTree()</td>
      <td>Calculate minimum spanning tree</td>
</tr>
<tr class="odd">
      <td>obj = topologyInterfaceToLink(agent,ifIndex)</td>
      <td>Lookup the link based on sFlow agent and ifIndex</td>
</tr>
<tr class="even">
      <td>obj = topologyLinkToInterfaces(name)</td>
      <td>Lookup interfaces attached to link</td>
</tr>
<tr class="odd">
      <td>array = topologyLinkMetric(name,metric&lt;,node&gt;)</td>
      <td>Get metrics associated with interfaces at each end of link. Optionally indicate direction by naming start node</td>
</tr>
<tbody>

</table>
<p><b>Note:</b> JavaScript API is not final and is subject to change in future releases.</p>
</div>
<#include "resources/filters/footer.ftl">

<#include "resources/filters/header.ftl"/>
<div id="content">
<h1>System Properties</h1>
<p>The following System properties can be set in the <b>start.sh</b> or <b>start.bat</b> script:</p>
<table>
<thead>
<tr><th>Property</th><th>Default</th><th>Description</th></tr></thead>
</thead>
<tbody>
<tr class="odd"><td>http.port</td><td>8008</td><td>TCP port to receive HTTP requests</td></tr>
<tr class="even"><td>http.log</td><td>no</td><td>Set to <i>yes</i> to enable http request logging</td></tr>
<tr class="odd"><td>http.html</td><td>yes</td><td>Set to <i>no</i> to exclude HTML pages</td></tr>
<tr class="even"><td>http.readonly</td><td>no</td><td>Set to <i>yes</i> to prevent POST/PUT operations from modifying thresholds, flows, and groups</td></tr>
<tr class="odd"><td>http.requestheadersize</td><td>4096</td><td>Size of the buffer to be used for request headers</td></tr>
<tr class="even"><td>http.requestbuffersize</td><td>8192</td><td>Size of the content buffer for receiving requests</td></tr>
<tr class="odd"><td>http.responseheadersize</td><td>4096</td><td>Size of the buffer to be used for response headers</td></tr>
<tr class="even"><td>http.responsebuffersize</td><td>32768</td><td>Size of the content buffer for sending responses</td></tr>
<tr class="odd"><td>script.file</td><td></td><td>Comma separated list of JavaScript files to load at startup, see <a href="script.html">JavaScript Functions</a>. Use <i>http.readonly=yes</i> to prevent modification of settings installed by scripts</td></tr>
<tr class="even"><td>script.store</td><td>store</td><td>Directory for storing persistent objects for scripts</td></tr>
<tr class="odd"><td>sflow.port</td><td>6343</td><td>UDP port to receive sFlow</td></tr>
<tr class="even"><td>sflow.file</td><td></td><td>Playback sFlow from pcap file (disables <i>sflow.port</i>)</td></tr>
<tr class="odd"><td>sflow.rcvpktsbuffer</td><td>1000</td><td>Number of 2028 byte packet buffers to request when opening the sFlow UDP socket</td></tr>
<tr class="even"><td>events.max</td><td>1000</td><td>Maximum number of events to keep</td></tr>
<tr class="odd"><td>flows.max</td><td>1000</td><td>Maximum number of completed flows to keep</td></tr>
<tr class="even"><td>geo.country</td><td></td><td>GeoIP database location.
Set to resources/config/GeoIP.dat to use GeoLite database</td></tr>
<tr class="odd"><td>geo.asn</td><td></td><td>GeoIP database location.
Set to resources/config/GeoIPASNum.dat to use GeoLite database</td></tr>
<tr class="even"><td>geo.country6</td><td></td><td>GeoIP database location.
Set to resources/config/GeoIPv6.dat to use GeoLite database</td></tr>
<tr class="odd"><td>geo.asn6</td><td></td><td>GeoIP database location.
Set to resources/config/GeoIPASNumv6.dat to use GeoLite database</td></tr>
<tr class="even"><td>oui.names</td><td></td><td>OUI name file. 
Set to resources/config/oui.txt to lookup names</td></tr>
<tr class="odd"><td>workers.maxqueue</td><td>400</td><td>Maximum number of sFlow datagrams to queue per worker</td></tr>
<tr class="even"><td>workers.number</td><td>4</td><td>Number of worker threads processing sFlow datagrams</td></tr>
<tr class="odd"><td>openflow.controller.start</td><td>no</td><td>Set to <i>yes</i> to enable the integrated hybrid OpenFlow controller</td></tr>
<tr class="even"><td>openflow.controller.port</td><td>6633</td><td>TCP port to connect to OpenFlow switches</td></tr>
<tr class="odd"><td>openflow.controller.threads</td><td>1</td><td>Number of threads used to service OpenFlow switches</td></tr>
<tr class="even"><td>openflow.controller.addNormal</td><td>no</td><td>Set to <i>yes</i> to enable setting of a default NORMAL rule in the switch (only use if this rule is required by the switches OpenFlow implementation)</td></tr>
<tr class="odd"><td>openflow.controller.flushRules</td><td>yes</td><td>Set to <i>yes</i> to flush all rules on an OpenFlow switch on connection, <i>no</i> to leave existing rules in place.</td></tr>
<tr class="even"><td>snmp.ifname</td><td>no</td><td>Set to <i>yes</i> to enable SNMP retrieval of interface names</td></tr>
<tr class="odd"><td>snmp.version</td><td>2c</td><td>SNMP version number, valid options are <i>1</i>, <i>2c</i>, or <i>3</i></td></tr>
<tr class="even"><td>snmp.community</td><td>public</td><td>Set SNMP community string</td></tr>
<tr class="odd"><td>snmp.user</td><td></td><td>Set SNMP user</td></tr>
<tr class="even"><td>snmp.authprotocol</td><td></td><td>Set SNMP authentication protocol, valid options are <i>md5</i> or <i>sha</i></td></tr>
<tr class="odd"><td>snmp.authpasswd</td><td></td><td>Set SNMP authentication password</td></tr>
<tr class="even""><td>snmp.privprotocol</td><td></td><td>Set SNMP privacy protocol, valid options are <i>des</i>, <i>3des</i>, <i>aes128</i>, <i>aes192</i> or <i>aes256</i></td></tr>
<tr class="odd"><td>snmp.privpasswd</td><td></td><td>Set SNMP privacy password</td></tr>
</tbody>
</table>
</div>
<#include "resources/filters/footer.ftl">

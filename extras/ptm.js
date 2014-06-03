function parsePTMDot(dot) {
 function trim(str) { return str.replace(/^\s+|\s+$/g, '');};
 var body = dot.match(/[^{}]+(?=\})/g);
 if(!body) return null;
 var links = {};
 var linkno = 1;
 for each (var tok in body[0].split(';')) {
  var link = tok.match(/(.*):(.*)->(.*):(.*)/);
  if(!link) continue;
  links['L' + linkno++] = {node1:trim(link[1]),port1:trim(link[2]),node2:trim(link[3]),port2:trim(link[4])};
 }
 return {links:links};
}

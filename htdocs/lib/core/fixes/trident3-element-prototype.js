;(function(){

var doc = document, win = window, Ep = win.Element.prototype

var classByNodeName =
{
	'SCRIPT': HTMLScriptElement,
	'INPUT': HTMLInputElement
}

// cache prototypes
var prototypeByNodeName = {}
for (var k in classByNodeName)
	prototypeByNodeName[k] = classByNodeName[k].prototype

function fixNodes (nodes)
{
	for (var i = 0, il = nodes.length; i < il; i++)
		fixNode(nodes[i])
}

function fixNode (node)
{
	if (node.__pmc__nodeFixed)
		return
	node.__pmc__nodeFixed = true
	
	// it is possible when prototypeByNodeName[…] inherits from Ep
	var proto = prototypeByNodeName[node.nodeName] || Ep
	for (var p in proto)
		node[p] = proto[p]
}


doc.__pmc__createElement = doc.createElement
doc.createElement = function (type)
{
	var node = doc.__pmc__createElement(type)
	fixNode(node)
	return node
}

// events must be fixed at this point to preserve handlers call order
win.addEventListener('load', function () { fixNodes(doc.all) })
document.__pmc__fixNodes = fixNodes

})();
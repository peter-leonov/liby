;(function(){

var doc = document, win = window, Ep = win.Element.prototype

function fixNodes (nodes)
{
	var proto = Ep
	for (var i = 0, il = nodes.length; i < il; i++)
	{
		var node = nodes[i]
		
		for (var p in proto)
			node[p] = proto[p]
	}
}

function fixNode (node)
{
	var proto = Ep
	for (var p in proto)
		node[p] = proto[p]
	
	return node
}


doc.__pmc__createElement = doc.createElement
doc.createElement = function (type) { return fixNode(doc.__pmc__createElement(type)) }

// events must be fixed at this point to preserve handlers call order
win.addEventListener('load', function () { fixNodes(doc.all) })
document.__pmc__fixNodes = fixNodes

})();
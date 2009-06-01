;(function(){

var doc = document, win = window, undef

if (win.Element)
	return

var Ep = {}
win.Element = {prototype:Ep}

function onpropertychange ()
{
	var e = event
	if (e.propertyName == 'innerHTML')
		fixNodes(e.srcElement.all)
}

// function appendChild (node) { this.appendChildReal(node) }

function fixNodes (nodes)
{
	var proto = Ep
	
	for (var i = 0, il = nodes.length; i < il; i++)
	{
		var node = node[i]
		
		for (var p in proto)
			node[p] = proto[p]
		
		node.attachEvent('onpropertychange', onpropertychange)
		// node.appendChildReal = node.appendChild
		// node.appendChild = fixAppendChild
		return node
		
	}
}


doc.createElementReal = doc.createElement
doc.createElement = function (type) { return fixNodes(doc.createElementReal(type)) }

// events must be fixed at this point to preserve handlers call order
win.addEventListener('load', function () { fixNodes(doc.all) })

})();
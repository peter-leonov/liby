;(function(){

var doc = document, win = window, Element = win.Element

var classByNodeName =
{
	'IMG': HTMLImageElement,
	'SCRIPT': HTMLScriptElement,
	'INPUT': HTMLInputElement,
	'FORM': HTMLFormElement
}

Element.__liby_fixHooks = []
for (var k in classByNodeName)
	classByNodeName[k].__liby_fixHooks = []

function bakeFixHooks ()
{
	var element = Element.__liby_fixHooks
	for (var k in classByNodeName)
		classByNodeName[k].__liby_fixHooks = element.concat(classByNodeName[k].__liby_fixHooks)
}

function fixNodes (nodes)
{
	for (var i = 0, il = nodes.length; i < il; i++)
		fixNode(nodes[i])
}

function fixNode (node)
{
	if (node.__liby__nodeFixed)
		return
	node.__liby__nodeFixed = true
	
	var klass = classByNodeName[node.nodeName] || Element
	
	// In the version for MSIE 6 and 7
	// this lines implement Element.prototype.
	// This is the only difference between two files.
	// Fixinf for MSIE 8 is needed to imlement such things
	// as <input> focus bubbling, <script> onload event fix, etc.
	
	var hooks = klass.__liby_fixHooks
	if (hooks)
		for (var i = 0, il = hooks.length; i < il; i++)
			hooks[i](node)
}

// // to fire propertychange (and other) events node has to be added to the document tree
// var sandbox = document.createElement('div')
// document.documentElement.appendChild(sandbox)

doc.__liby__createElement = doc.createElement
doc.createElement = function (type)
{
	var node = doc.__liby__createElement(type)
	fixNode(node)
	// sandbox.appendChild(node)
	return node
}

function onload ()
{
	bakeFixHooks()
	fixNodes(doc.all)
}

// events must be fixed at this point to preserve handlers call order
document.addEventListener('DOMContentLoaded', onload)
document.__liby__fixNodes = fixNodes

})();

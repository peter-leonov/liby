// NodesShortcut
;(function(){

var doc = document, undef
function T (text) { return doc.createTextNode(text) }
function N (tag, cn, text)
{
	var node = doc.createElement(tag)
	if (cn !== undef) node.className = cn
	if (text !== undef) node.appendChild(T(text))
	return node
}

function E (tag, cn, props)
{
	var node = doc.createElement(tag)
	if (cn !== undef) node.className = cn
	if (props)
		for (var i in props)
			node.setAttribute(i, props[i])
	return node
}

Programica.NodesShortcut = function () { return 'var doc = document; var T = Programica.NodesShortcut.T; var N = Programica.NodesShortcut.N; var E = Programica.NodesShortcut.E' }
Programica.NodesShortcut.T = T
Programica.NodesShortcut.N = N
Programica.NodesShortcut.E = E

})();

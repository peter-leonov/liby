// NodesShortcut
;(function(){

var doc = document, undef, myName = 'NodesShortcut'

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

var code = 'var T=' + myName + '.T,N=' + myName + '.N,E=' + myName + '.E',
	Me = self[myName] = function () { return code }

Me.T = T
Me.N = N
Me.E = E

})();

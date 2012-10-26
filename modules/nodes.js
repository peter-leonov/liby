;(function(){ // new

var doc = document

var prototype =
{
	add: function (tag, cn)
	{
		var node = doc.createElement(tag)
		node.className = cn
		this.appendChild(node)
		return node
	},
	
	text: function (text)
	{
		var node = doc.createTextNode(text)
		this.appendChild(node)
		return node
	}
}

Object.add(Element.prototype, prototype)

})();


;(function(){ // old

var doc = document, undef, myName = 'NodesShortcut'

function T (text)
{
	return doc.createTextNode(text)
}

function N (tag)
{
	return doc.createElement(tag)
}

function Nc (tag, cn)
{
	var node = doc.createElement(tag)
	node.className = cn
	return node
}

function Nct (tag, cn, text)
{
	var node = doc.createElement(tag)
	node.className = cn
	node.appendChild(doc.createTextNode(text))
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

var Me = self[myName] = {}
	funcs = Me.funcs = {T: T, N: N, Nc: Nc, Nct: Nct, E: E}

var pairs = []
for (var k in funcs)
	pairs.push(k + '=' + myName + '.funcs.' + k)

Me.code = 'var ' + pairs.join(',')
Me.include = function () { return this.code }


})();

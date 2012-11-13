;(function(){

function NodesBuilder (node)
{
	this.node = node
	return this
}

var proto = NodesBuilder.prototype
var plain = NodesBuilder.plain = {}

plain.text = function (text)
{
	return doc.createTextNode(text)
}

proto.text = function (text)
{
	var node = doc.createTextNode(text)
	this.node.appendChild(node)
	return node
}

proto.add = function (tag, cn)
{
	var node = doc.createElement(tag)
	node.className = cn
	this.node.appendChild(node)
	return new NodesBuilder(node)
}


var tags = 'div span a ul dl li dt dd img input textarea'.split(' ')
for (var i = 0, il = tags.length; i < il; i++)
	bakeShortcut(tags[i])


var doc = document

function bakeShortcut (tag)
{
	proto[tag] = function (cn)
	{
		var node = doc.createElement(tag)
		node.className = cn
		this.node.appendChild(node)
		return new NodesBuilder(node)
	}
	
	NodesBuilder[tag] = function (cn)
	{
		var node = doc.createElement(tag)
		node.className = cn
		return new NodesBuilder(node)
	}
	
	plain[tag] = function (cn)
	{
		var node = doc.createElement(tag)
		node.className = cn
		return node
	}
}

self[NodesBuilder.name] = NodesBuilder

})();

;(function(){

function NodesBuilder (node)
{
	this.node = node
}

var proto = NodesBuilder.prototype
var plain = NodesBuilder.plain = {}

proto.text = plain.text = function (text)
{
	var node = doc.createTextNode(text)
	this.node.appendChild(node)
	return node
}


var tags = ['div', 'span', 'ul', 'dl', 'li', 'dt', 'dd', 'img']
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

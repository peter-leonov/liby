;(function(){

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

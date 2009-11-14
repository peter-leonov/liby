;(function(){

var myName = 'Dots', doc = document, undef

var Me = self[myName] =
{
	adjust: function (nodes, length)
	{
		if (length === undef)
			length = 16
		
		for (var i = 0; i < nodes.length; i++)
		{
			var node = nodes[i]
			
			if (node.scrollWidth > node.offsetWidth)
			{
				var text = node.firstChild,
					string = text.nodeValue
				node.realText = string
				text.nodeValue = string.substr(0, length) + '…'
				node.title = string
			}
		}
	}
}

})();
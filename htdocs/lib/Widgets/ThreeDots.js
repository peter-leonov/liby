ThreeDots =
{
	adjustTextSize: function (nodes)
	{
		for (var i = 0; i < nodes.length; i++)
		{
			var node = nodes[i]
			
			if (node.scrollWidth > node.offsetWidth)
			{
				var text = node.firstChild,
					string = text.nodeValue
				node.realText = string
				text.nodeValue = string.substr(0, 16) + '…'
				node.title = string
			}
		}
	},
	
	adjustTextSizeOfNodes: function (root, selector)
	{
		var me = this
		setTimeout(function () { me.adjustTextSize(cssQuery(selector, root)) }, 1)
	}
}
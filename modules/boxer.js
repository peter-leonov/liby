;(function(){

var myName = 'Boxer'

var Me =
{
	nodesToBoxes: function (nodes, root, width, height)
	{
		var boxes = []
		
		var custom = width !== undefined && height !== undefined
		
		var lastParent = root, position = {left: 0, top: 0}
		for (var i = 0, il = nodes.length; i < il; i++)
		{
			var node = nodes[i],
				parent = node.offsetParent
			
			if (!parent)
				continue
			
			if (parent != lastParent)
			{
				lastParent = parent
				position = parent.offsetPosition(root)
			}
			
			var box =
			{
				x: node.offsetLeft + position.left,
				y: node.offsetTop + position.top,
				node: node
			}
			
			if (custom)
			{
				box.w = width
				box.h = height
			}
			else
			{
				box.w = node.offsetWidth
				box.h = node.offsetHeight
			}
			
			boxes.push(box)
		}
		
		return boxes
	},
	
	sameNodesToBoxes: function (nodes, root)
	{
		var first = nodes[0]
		if (!first)
			return []
		
		return this.nodesToBoxes(nodes, root, first.offsetWidth, first.offsetHeight)
	}
}

// Me.mixIn(EventDriven)
Me.className = myName
self[myName] = Me

})();
;(function(){

var myName = 'Boxer'

var Me =
{
	nodesToBoxes: function (root, nodes)
	{
		var lastParent = root, position = {left: 0, top: 0}, boxes = []
		for (var i = 0, il = nodes.length; i < il; i++)
		{
			var node = nodes[i],
				parent = node.offsetParent
			
			if (parent != lastParent)
			{
				lastParent = parent
				position = parent.offsetPosition(root)
			}
			
			boxes[i] =
			{
				x: node.offsetLeft + position.left,
				y: node.offsetTop + position.top,
				w: node.offsetWidth,
				h: node.offsetHeight,
				node: node
			}
		}
		
		return boxes
	}
}

// Me.mixIn(EventDriven)
Me.className = myName
self[myName] = Me

})();
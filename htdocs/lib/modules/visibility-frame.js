;(function(){

var myName = 'VisibilityFrame'

function Me ()
{
	this.gridder = new Gridder()
	this.nodes = []
	this.boxes = []
	this.constructor = Me
}

Me.prototype =
{
	setNodes: function (nodes)
	{
		this.nodes = nodes
		
		var boxes = this.boxes = []
		for (var i = 0, il = nodes.length; i < il; i++)
		{
			var node = nodes[i]
			
			boxes[i] =
			{
				x: node.offsetLeft,
				y: node.offsetTop,
				w: node.offsetWidth,
				h: node.offsetHeight,
				node: node // custom fields are normal
			}
		}
		
		this.gridder.setBoxes(boxes)
	},
	
	setFrame: function (w, h)
	{
		this.width = w
		this.height = h
	},
	
	moveTo: function (x, y)
	{
		
	}
}

Me.className = myName
self[myName] = Me

})();
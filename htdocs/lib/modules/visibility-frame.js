;(function(){

var myName = 'VisibilityFrame'

function Me ()
{
	this.gridder = new Gridder()
	this.gridder.maxSteps = 10000
	this.nodes = []
	this.boxes = []
	this.visible = []
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
		
		this.gridder.setStep(250, 250)
	},
	
	moveTo: function (x, y)
	{
		var visible = this.visible
		
		for (var i = 0, il = visible.length; i < il; i++)
			visible[i].node.className = ''
		
		var boxes = this.gridder.getBoxesPrecise(x, y, this.width, this.height)
		
		for (var i = 0, il = boxes.length; i < il; i++)
		{
			var box = boxes[i]
			box.node.className = 'visible'
		}
		
		this.visible = boxes
	}
}

Me.className = myName
self[myName] = Me

})();
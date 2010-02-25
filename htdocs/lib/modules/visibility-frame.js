;(function(){

var myName = 'VisibilityFrame'

function Me ()
{
	this.gridder = new Gridder()
	this.nodes = []
	this.boxes = []
	this.visible = {}
	this.constructor = Me
}

Me.prototype =
{
	onmove: function (show, hide, visible) {},
	
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
	
	// // slow version
	// moveTo: function (x, y)
	// {
	// 	var boxes = this.gridder.getBoxesPrecise(x, y, this.width, this.height)
	// 	
	// 	var visible = this.visible
	// 	this.visible = boxes
	// 	
	// 	this.onmove(boxes, visible, boxes)
	// },
	
	// much faster version
	moveTo: function (x, y)
	{
		var last = this.visible, current = {}, show = [], hide = []
		
		var boxes = this.gridder.getBoxesPrecise(x, y, this.width, this.height)
		for (var i = 0, il = boxes.length; i < il; i++)
		{
			var box = boxes[i],
				id = box.boxID
			
			if (id in last)
				delete last[id]
			else
				show.push(box)
			
			current[id] = box
		}
		
		for (var k in last)
			hide.push(last[k])
		
		this.visible = current
		
		this.onmove(show, hide, boxes)
	}
}

Me.className = myName
self[myName] = Me

})();
;(function(){

var myName = 'VisibilityFrame'

function Me ()
{
	this.x = 0
	this.y = 0
	this.gridder = new Gridder()
	this.boxes = []
	this.visible = {}
	this.constructor = Me
}

Me.prototype =
{
	onmove: function (show, hide, visible) {},
	
	setBoxes: function (boxes)
	{
		this.boxes = boxes
		this.visible = {}
		
		this.gridder.setBoxes(boxes)
		this.update()
	},
	
	setFrame: function (w, h, x, y)
	{
		this.width = w
		this.height = h
		
		if (x && y)
			this.setStep(x, y)
	},
	
	setStep: function (x, y)
	{
		this.gridder.setStep(x, y)
	},
	
	// much faster version
	moveTo: function (x, y)
	{
		this.x = x
		this.y = y
		
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
	},
	
	update: function ()
	{
		this.moveTo(this.x, this.y)
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
	// }
	
	getGridder: function ()
	{
		return this.gridder
	}
}

Me.className = myName
self[myName] = Me

})();
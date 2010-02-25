;(function(){

var myName = 'VisibilityFrame'

function Me ()
{
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
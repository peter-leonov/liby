;(function(){

var myName = 'Gridder'

function Me (boxes, x, y)
{
	this.boxes = []
	this.gridH = {}
	this.gridA = []
	this.constructor = Me
	
	if (boxes)
		this.setBoxes(boxes)
	
	if (x && y)
		this.setStep(x, y)
}

Me.prototype =
{
	stepX: 500, stepY: 500,
	maxSteps: 1000,
	
	reflow: function ()
	{
		var boxes = this.boxes, gridH = this.gridH = {}, gridA = this.gridA = [],
			sx = this.stepX, sy = this.stepY,
			stepsLeft = this.maxSteps
		
		var ceil = Math.ceil
		
		for (var i = 0, il = boxes.length; i < il; i++)
		{
			var box = boxes[i]
			
			// x and width
			var x1, x2, x = box.x, w = box.w
			x1 = x < 0 ? -ceil(-x / sx) : x / sx >> 0
			if (w <= 0)
				x2 = x1
			else
			{
				x += w
				x2 = x > 0 ? ceil(x / sx) - 1 : (x / sx >> 0) - 1
			}
			
			// y and height
			var y1, y2, y = box.y, h = box.h
			y1 = y < 0 ? -ceil(-y / sy) : y / sy >> 0
			if (h <= 0)
				y2 = y1
			else
			{
				y += h
				y2 = y > 0 ? ceil(y / sy) - 1 : (y / sy >> 0) - 1
			}
			
			for (var x = x1; x <= x2; x++)
			for (var y = y1; y <= y2; y++)
			{
				if (0 == stepsLeft--)
					throw new Me.Error('too many steps (' + this.maxSteps + ')')
				
				// check diapason of the values
				if (x >> 15 || y >> 15)
				{
					// unsafe, so using slow string key on gridH
					var key = x + ':' + y
					
					var cell = gridH[key]
					if (cell)
						cell.push(box)
					else
						gridH[key] = [box]
					
				}
				else
				{
					// safe, so using fast integer key on gridA
					var key = (x << 15) + y
					
					var cell = gridA[key]
					if (cell)
						cell.push(box)
					else
						gridA[key] = [box]
				}
			}
		}
	},
	
	setStep: function (x, y)
	{
		this.stepX = x
		this.stepY = y
		this.reflow()
	},
	
	setBoxes: function (boxes)
	{
		this.boxes = boxes
		this.reflow()
	},
	
	getBoxes: function (e)
	{
		return this.boxes
	},
	
	getCell: function (x, y)
	{
		return x >> 15 || y >> 15 ? this.gridH[x + ':' + y] : this.gridA[(x << 15) + y]
	}
}

Me.Error = function (m) { this.name = myName + '.Error'; this.message = m }
Me.Error.prototype = new Error()

Me.className = myName
self[myName] = Me

})();
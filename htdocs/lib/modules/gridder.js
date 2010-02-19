;(function(){

var myName = 'Gridder'

function Me (boxes, x, y)
{
	this.boxes = []
	this.grid = {}
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
		var boxes = this.boxes, grid = this.grid = {},
			sx = this.stepX, sy = this.stepY,
			stepsLeft = this.maxSteps
		
		for (var i = 0, il = boxes.length; i < il; i++)
		{
			var box = boxes[i],
				x = box.x / sx >> 0,
				y = box.y / sy >> 0,
				w = Math.floor(box.w / sx),
				h = Math.floor(box.h / sy)
			
			// every box gets at least one cell (via “<=”)
			var jl = x + w, kl = y + h
			for (var j = x; j <= jl; j++)
				for (var k = y; k <= kl; k++)
				{
					if (0 == stepsLeft--)
						throw new Me.Error('to many steps (' + this.maxSteps + ')')
					
					// a little bit slowly but much more reliable than j << 16 + k
					var cell = j + ':' + k
					if (cell in grid)
						grid[cell].push(box)
					else
						grid[cell] = [box]
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
		return this.grid[x + ':' + y]
	}
}

Me.Error = function (m) { this.name = myName + '.Error'; this.message = m }
Me.Error.prototype = new Error()

Me.className = myName
self[myName] = Me

})();
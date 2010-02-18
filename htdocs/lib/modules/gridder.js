;(function(){

var myName = 'Gridder'

function Me (boxes)
{
	this.boxes = []
	this.grid = {}
	this.constructor = Me
	
	if (boxes)
		this.addBoxes(boxes)
}

Me.prototype =
{
	stepX: 500, stepY: 500,
	maxCells: 100,
	
	reflow: function ()
	{
		var boxes = this.boxes, grid = this.grid = [],
			sx = this.stepX, sy = this.stepY,
			cellsLeft = this.maxCells
		
		for (var i = 0, il = boxes.length; i < il; i++)
		{
			if (0 == cellsLeft--)
				throw new Error('to many cells (' + this.maxCells + ')')
			
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
					var cell = j + ':' + k
					if (cell in grid)
						grid[cell].push(box)
					else
						grid[cell] = [box]
				}
		}
		
		// log(grid)
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
	}
}

Me.className = myName
self[myName] = Me

})();
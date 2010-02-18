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
	
	reflow: function ()
	{
		log('reflow')
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
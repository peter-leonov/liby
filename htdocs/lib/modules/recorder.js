;(function(){

var myName = 'Recorder'

function Me ()
{
	this.actions = []
}

Me.prototype =
{
	addListeners: function ()
	{
		var me = this
		function listener (e) { me.record(e) }
		this.listener = listener
		document.addEventListener('mousemove', listener, true)
	},
	
	removeListeners: function ()
	{
		var listener = this.listener
		document.removeEventListener('mousemove', listener, true)
	},
	
	start: function ()
	{
		this.start = new Date()
		this.addListeners()
	},
	
	stop: function ()
	{
		this.removeListeners()
	},
	
	record: function (e)
	{
		var action =
		{
			type: e.type,
			target: e.target,
			point: {x: e.clientX, y: e.clientY},
			t: new Date() - this.start
		}
		this.actions.push(action)
	},
	
	play: function ()
	{
		log('playing ', this.actions.length)
		// document.removeEventListener('mousemove', mousemove, false)
		// document.removeEventListener('keypress', keypress, false)
		this.cursor = document.body.appendChild(document.createElement('div'))
		this.cursor.id = 'recorder-cursor'
		this.frame = 0
		this.start = new Date()
		clearTimeout(this.timer)
		var me = this
		this.callFrame = function () { me.nextFrame() }
		this.timer = setTimeout(this.callFrame, 0)
	},
	
	nextFrame: function ()
	{
		var action = this.actions[this.frame++]
		if (action)
		{
			var point = action.point
			// cursor = cursor.cloneNode(false)
			// document.body.appendChild(cursor)
			var style = this.cursor.style
			style.left = point.x + 'px'
			style.top = point.y + 'px'
			var next = action.t - (new Date() - this.start)
			setTimeout(this.callFrame, next)
			
			var e = document.createEvent('MouseEvents')
			e.initMouseEvent('mousemove', true, true, window,  0, 0, 0, point.x, point.y, false, false, false, false, 0, null)
			action.target.dispatchEvent(e)
			// document.elementFromPoint(point.x, point.y)
		}
	}
}

self[myName] = Me

})();
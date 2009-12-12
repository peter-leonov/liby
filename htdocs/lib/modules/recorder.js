;(function(){

var myName = 'Recorder'

function Me () {}

Me.prototype =
{
	bind: function (doc, body)
	{
		this.doc = doc
		this.cursor = body.appendChild(doc.createElement('div'))
		this.cursor.id = 'recorder-cursor'
	},
	
	addListeners: function ()
	{
		var me = this
		function listener (e) { me.record(e) }
		this.listener = listener
		this.doc.addEventListener('mousemove', listener, true)
	},
	
	removeListeners: function ()
	{
		var listener = this.listener
		this.doc.removeEventListener('mousemove', listener, true)
	},
	
	start: function ()
	{
		this.actions = []
		this.begin = new Date()
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
			t: new Date() - this.begin
		}
		this.actions.push(action)
	},
	
	play: function ()
	{
		if (!this.actions)
			throw new Error('nothing to playback')
		this.stop()
		log('playing:', this.actions.length)
		// this.doc.removeEventListener('mousemove', mousemove, false)
		// this.doc.removeEventListener('keypress', keypress, false)
		this.frame = 0
		this.begin = new Date()
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
			// this.doc.body.appendChild(cursor)
			var style = this.cursor.style
			style.left = point.x + 'px'
			style.top = point.y + 'px'
			var next = action.t - (new Date() - this.begin)
			setTimeout(this.callFrame, next)
			
			var e = this.doc.createEvent('MouseEvents')
			e.initMouseEvent('mousemove', true, true, window,  0, 0, 0, point.x, point.y, false, false, false, false, 0, null)
			action.target.dispatchEvent(e)
			// this.doc.elementFromPoint(point.x, point.y)
		}
	}
}

self[myName] = Me

})();
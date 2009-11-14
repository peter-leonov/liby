;(function () {

var M = Math, Me = Motion = function (begin, end, duration, motion, onstep, onstop)
{
	var me = this, frame = 0, total = M.ceil(duration * Me.fps), delta = end - begin
	
	this.onstop = onstop
	this.onstep = onstep
	this.step = function ()
	{
		me.onstep(motion(frame, begin, delta, total))
		if (frame++ >= total)
			me.stop(true)
	}
	
}

Me.prototype =
{
	start: function ()
	{
		if (!this.running)
		{
			this.running = true
			Me.removeTimer(this.timer)
			this.timer = Me.addTimer(this.step) // step is already a prepared callback
		}
		return this
	},
	
	stop: function (comleted)
	{
		if (this.running)
		{
			this.running = false
			Me.removeTimer(this.timer)
			if (this.onstop)
				this.onstop(comleted)
		}
		return this
	}
}


// one global timer implementation

Me.fps = 60
var timers = Me.timers = {}
Me.total = 0
Me.id = 0

Me.tick = function (d)
{
	var timer
	for (var k in timers)
		if ((timer = timers[k]))
			timer(d)
}

Me.addTimer = function (callback)
{
	// if was no timers
	if (this.total++ <= 0)
	{
		var t = this
		this.timer = setInterval(this.tick, 1000 / this.fps)
	}
	
	this.timers[++this.id] = callback
	return this.id
}

Me.removeTimer = function (id)
{
	if (this.timers[id])
	{
		delete this.timers[id]
		
		// if have deleted last timer
		if (--this.total <= 0)
			clearInterval(this.timer)
	}
}

Me.types = <!--#include virtual="motion-types.js" -->

})();

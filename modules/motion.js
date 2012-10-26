;(function () {

var M = Math, myName = 'Motion', globalTimer = GlobalTimer
function Me (begin, end, duration, motion, onstep, onstop)
{
	var me = this, frame = 0, total = M.ceil(duration * globalTimer.fps), delta = end - begin
	
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
			globalTimer.remove(this.timer)
			this.timer = globalTimer.add(this.step) // step is already a prepared callback
		}
		return this
	},
	
	stop: function (comleted)
	{
		if (this.running)
		{
			this.running = false
			globalTimer.remove(this.timer)
			if (this.onstop)
				this.onstop(comleted)
		}
		return this
	}
}

self[myName] = Me

})();

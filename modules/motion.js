;(function () {

function Motion (begin, end, duration, motion, onstep, onstop)
{
	var me = this, frame = 0, total = Math.ceil(duration * GlobalTimer.fps), delta = end - begin
	
	this.onstop = onstop
	this.onstep = onstep
	this.step = function ()
	{
		me.onstep(motion(frame, begin, delta, total))
		if (frame++ >= total)
			me.stop(true)
	}
	
}

Motion.prototype =
{
	start: function ()
	{
		if (!this.running)
		{
			this.running = true
			GlobalTimer.remove(this.timer)
			this.timer = GlobalTimer.add(this.step) // step is already a prepared callback
		}
		return this
	},
	
	stop: function (comleted)
	{
		if (this.running)
		{
			this.running = false
			GlobalTimer.remove(this.timer)
			if (this.onstop)
				this.onstop(comleted)
		}
		return this
	}
}

self.Motion = Motion

})();

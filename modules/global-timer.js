;(function () {

var myName = 'GlobalTimer', Me =
{
	fps: 60,
	total: 0,
	id: 0,
	timers: {},
	timer: null,
	
	tick: function (d)
	{
		var timer, timers = this.timers
		for (var id in timers)
			if ((timer = timers[id]))
				timer(d)
	},
	
	add: function (callback)
	{
		// if was no timers
		if (this.total++ <= 0)
		{
			if (this.timer !== null)
				throw new Error(myName + '.timer had been broken')
			var me = this
			this.timer = window.setInterval(function (d) { me.tick(d) }, 1000 / this.fps)
		}
		
		this.timers[++this.id] = callback
		return this.id
	},
	
	remove: function (id)
	{
		if (id in this.timers)
		{
			var callback = this.timers[id]
			delete this.timers[id]
			
			// if have deleted last timer
			if (--this.total <= 0)
			{
				window.clearInterval(this.timer)
				this.timer = null
			}
			
			return callback
		}
	},
	
	clear: function (d)
	{
		var timers = this.timers
		for (var id in timers)
			this.remove(id)
	}
}

self[myName] = Me

})();

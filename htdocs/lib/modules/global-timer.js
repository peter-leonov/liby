;(function () {

var myName = 'GlobalTimer', Me =
{
	fps: 60,
	total: 0,
	id: 0,
	timers: {},
	
	tick: function (d)
	{
		var timer, timers = this.timers
		for (var k in timers)
			if ((timer = timers[k]))
				timer(d)
	},
	
	add: function (callback)
	{
		// if was no timers
		if (this.total++ <= 0)
		{
			var me = this
			this.timer = setInterval(function (d) { me.tick(d) }, 1000 / this.fps)
		}
		
		this.timers[++this.id] = callback
		return this.id
	},
	
	remove: function (id)
	{
		if (this.timers[id])
		{
			delete this.timers[id]
			
			// if have deleted last timer
			if (--this.total <= 0)
				clearInterval(this.timer)
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

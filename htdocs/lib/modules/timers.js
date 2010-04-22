;(function(){

var myName = 'Timers'

function Me () {}

function expireTimers ()
{
	var timers
	if (!(timers = this.__timers))
		return
	
	var now = +new Date(), todo = [], min = Infinity
	for (var k in timers)
	{
		var d = k - now
		if (d <= 0)
			todo.push(+k)
		else
			if (d < min)
				min = d
	}
	
	todo.sort()
	for (var i = todo.length - 1; i >= 0; i--)
	{
		var t = todo[i], arr = timers[t]
		delete timers[t]
		for (var j = 0; j < arr.length; j++)
		{
			var f = arr[j]
			try
			{
				f.call(this, -d)
			}
			catch (ex) { Nginx.logError(Nginx.LOG_CRIT, ex.message) }
		}
	}
	
	if (min < Infinity)
		this.setTimer(expireTimers, min)
}

Me.prototype =
{
	setTimeout: function (f, d)
	{
		if ((d = +d)) // isn't a NaN
		{
			if (d < 0)
				d = 0
		}
		else
			d = 0
		
		var timers
		if (!(timers = this.__timers))
			timers = this.__timers = {}
		
		var t = +new Date() + d
		
		if (timers[t])
			timers[t].push(f)
		else
			timers[t] = [f]
		
		this.setTimer(expireTimers, 1)
	}
}

Me.className = myName
self[myName] = Me

})();
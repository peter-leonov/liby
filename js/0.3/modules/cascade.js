;(function () {

var myName = 'Cascade', Me = self[myName] = function () {}
Me.prototype =
{
	oncomplete: function () {},
	onerror: function () {},
	current: 0,
	completed: false,
	aborted: false,
	
	initialize: function ()
	{
		this.timers = {}
		return this
	},
	
	add: function (f, d)
	{
		if (this.completed)
			throw new Error('add after completed')
		
		var num = this.current++
		
		var me = this
		function caller ()
		{
			try
			{
				f(me, num)
			}
			catch (ex)
			{
				me.onerror(ex, num)
			}
			if (!me.aborted)
				me.finished(num)
		}
		
		if (d !== -1)
			var timer = setTimeout(caller, d || 0)
		else
			timer = -1
		
		this.timers[num] = timer
		
		return num
	},
	
	finished: function (num)
	{
		if (this.completed)
			throw new Error('finished() after completed')
		
		var timers = this.timers
		clearTimeout(timers[num])
		delete timers[num]
		
		var count = 0
		for (var k in timers)
			count++
		
		if (count == 0)
		{
			var me = this
			this.completed = true
			this.comleteTimer = setTimeout(function () { me.oncomplete() }, 0)
		}
	},
	
	abort: function ()
	{
		if (this.completed)
			return
		
		if (this.comleteTimer)
			clearTimeout(this.comleteTimer)
		
		var timers = this.timers
		for (var k in timers)
		{
			clearTimeout(timers[k])
			delete timers[k]
		}
		
		this.aborted = true
	}
}

})();

;(function () {

var myName = 'Cascade'

function Me (job)
{
	this.timers = {}
	this.data = {}
	this.children = []
	this.job = job
}

Me.running = 0

Me.prototype =
{
	completed: false,
	selfCompleted: false,
	holder: self, // window
	
	onerror: function (ex, job)
	{
		if (this.parent)
			this.parent.onerror(ex, job || this)
		else
			throw ex
	},
	
	oncomplete: function () {},
	_oncomplete: function ()
	{
		if (this.parent)
			this.parent.sigchild(this)
		
		this.oncomplete()
	},
	
	run: function (delay)
	{
		Me.running++
		
		var me = this
		this.timer('job', function () { me._run() }, delay)
	},
	
	_run: function ()
	{
		try
		{
			this.job.call(this.data, this)
		}
		catch (ex)
		{
			this.onerror(ex)
		}
		
		this.selfCompleted = true
		this.sigchild()
	},
	
	add: function (job)
	{
		if (this.completed)
			return
		
		var children = this.children
		
		if (typeof job === 'function')
			job = new Me(job)
		else
			if (children.indexOf(job) >= 0)
				return null
		
		job.parent = this
		children.push(job)
		return job
	},
	
	sigchild: function ()
	{
		if (this.completed)
			return
		
		if (!this.selfCompleted)
			return
		
		var children = this.children, count = 0
		for (var i = 0; i < children.length; i++)
			if (!children[i].completed)
				count++
		
		if (count == 0)
		{
			this.completed = true
			Me.running--
			var me = this
			this.timer('completed', function () { me._oncomplete() }, 0)
		}
	},
	
	stop: function ()
	{
		if (!this.completed)
		{
			this.timersClear()
			
			var children = this.children
			for (var i = 0; i < children.length; i++)
				children[i].stop()
			
			this.selfCompleted = true
			
			this.sigchild()
		}
		
		return this.completed
	},
	
	timer: function (name, func, delay)
	{
		var timers = this.timers, holder = this.holder
		if (timers[name])
			holder.clearTimeout(timers[name])
		
		return timers[name] = holder.setTimeout(func, delay)
	},
	
	timersClear: function ()
	{
		var timers = this.timers, holder = this.holder
		for (var k in timers)
		{
			holder.clearTimeout(timers[k])
			delete timers[k]
		}
	}
}

self[myName] = Me

})();
;(function(){

var myName = 'Test'

function indexOf (a, v, i)
{
	var len = a.length,
		i = +i || 0
	i = (i < 0) ? (Math.ceil(i) + len) : Math.floor(i)

	for (; i < len; i++)
		if (i in a && a[i] === v)
			return i
	return -1
}

function Me (parent, name, conf, job, callback)
{
	this.conf = conf || {}
	this.results = []
	
	this.childrenQueue = []
	this.childrenSpawned = 0
	this.childrenParallelLimit = Infinity
	
	this.parent = parent
	this.reporter = parent.reporter.create()
	this.reporter.name(name || '(untitled)')
	this.job = job
	this.callback = callback
	
	this.tool = new Me.Tool(this)
}

Me.prototype =
{
	status: 'new',
	finished: false,
	reporter: devNull,
	
	test: function (name, conf, job)
	{
		if (arguments.length == 2)
		{
			job = conf
			conf = undefined
		}
		else if (arguments.length == 1)
		{
			job = name
			conf = undefined
			name = undefined
		}
		
		if (typeof job !== 'function')
			throw new Error('job is not present')
		
		var test = new Me(this, name, conf, job, this.q.wait())
		
		this.addChildTest(test)
	},
	
	run: function (callback)
	{
		var me = this
		this.q = Q.all(function () { me._done() })
		
		var last = this.q.wait()
		this.exec(this.job, [this.tool])
		last()
	},
	
	exec: function (f, args)
	{
		try
		{
			f.apply(null, args)
		}
		catch (ex)
		{
			this.fail([ex], 'got an exception')
			window.setTimeout(function () { throw ex }, 0)
		}
	},
	
	async: function (f, d)
	{
		var w = this.q.wait()
		this.setStatus('waiting')
		
		var me = this
		function callback ()
		{
			try
			{
				f(me.tool)
			}
			finally
			{
				w()
			}
		}
		window.setTimeout(callback, d)
	},
	
	wait: function (d)
	{
		this.q.wait()
		this.setStatus('waiting')
		
		if (d === undefined)
			return
		
		var me = this
		window.setTimeout(function () { me.timedOut() }, d)
	},
	
	timedOut: function ()
	{
		if (this.finished)
			return
		
		this.fail(new Me.Label('test timed out'))
		this.done()
	},
	
	done: function ()
	{
		this.q.fire()
	},
	
	_done: function ()
	{
		if (this.finished)
			return
		
		var results = this.results, expect = this.conf.expect
		
		if (typeof expect == 'number')
			expect = [expect]
		
		if (expect !== undefined && indexOf(expect, results.length) == -1)
			this.fail(new Me.Label(expect + ' expected but ' + results.length + ' run'))
		
		var ok = true
		for (var i = 0; i < results.length; i++)
			if (results[i].status == 'failed')
				ok = false
		
		if (this.conf.failing)
			ok = !ok
		
		var status
		if (this.conf.mayFail && !ok)
			status = 'warned'
		else
			status = ok ? 'passed' : 'failed'
		
		this.setStatus(status)
		this.finished = true
		this.summary()
		this.parent.childTest(this)
		this.callback()
	},
	
	addChildTest: function (test)
	{
		this.childrenQueue.push(test)
		this.spawnChildren()
	},
	
	spawnChildren: function ()
	{
		while (this.childrenSpawned < this.childrenParallelLimit)
		{
			this.childrenSpawned++
			
			var test = this.childrenQueue.shift()
			if (!test)
				break
			
			run(test)
		}
		
		function run (test)
		{
			window.setTimeout(function () { test.run() }, 0)
		}
	},
	
	childTest: function (test)
	{
		var status = test.status
		if (status === 'failed')
			this.fail()
		else if (status === 'passed')
			this.pass()
		
		this.childrenSpawned--
		this.spawnChildren()
	},
	
	summary: function ()
	{
		var results = this.results, failed = 0, passed = 0
		for (var total = 0; total < results.length; total++)
		{
			var res = results[total]
			if (res.status == 'failed')
				failed++
			else if (res.status == 'passed')
				passed++
		}
		
		var text = [passed + ' passed']
		if (failed)
			text.push(failed + ' failed')
		
		text.push(total + ' done')
		
		this.reporter.summary(text.join(', ') + '.')
	},
	
	expect: function (amount) { this.conf.expect = amount },
	failing: function (v) { this.conf.failing = v === undefined ? true : v },
	mayFail: function (v) { this.conf.mayFail = v === undefined ? true : v },
	
	pass: function (m, d)
	{
		this.results.push({status: 'passed', message: m, description: d})
		if (m || d)
			this.reporter.pass(m, d)
		
		return true
	},
	
	fail: function (m, d)
	{
		this.results.push({status: 'failed', message: m, description: d})
		if (m || d)
			this.reporter[this.conf.mayFail ? 'warn' : 'fail'](m, d)
		
		return false
	},
	
	setStatus: function (s)
	{
		this.status = s
		this.reporter.setStatus(s)
	}
}

Me.className = myName
self[myName] = Me

var empty = function () {}, devNull =
{
	create: function () { return devNull },
	setStatus: empty, fail: empty, pass: empty, info: empty, summary: empty
}

})();
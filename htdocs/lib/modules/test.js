;(function(){

var myName = 'Test', Me = self[myName] = function (parent, name, conf, callback)
{
	this.conf = conf || {}
	this.results = []
	
	this.parent = parent
	this.name = name || '(untitled)'
	this.callback = callback
	
	this.tool = new Me.Tool(this)
	
	var c = this.cascade = new Cascade()
	var me = this
	c.oncomplete = function () { me.done() }
	c.onerror = function (ex) { me.fail(ex.message, 'got an error form cascade') }
}
Me.prototype =
{
	status: 'new',
	finished: false,
	reporter: devNull,
	
	run: function (delay)
	{
		var me = this
		this.reporter.name(this.name)
		this.cascade.job = function () { me._run(me.callback) }
		this.cascade.run(delay)
	},
	
	_run: function (f)
	{
		try
		{
			f(this.tool)
		}
		catch (ex)
		{
			this.fail([ex.message, ex.fileName || ex.sourceURL, ex.line || ex.lineNumber], 'got an exception')
		}
	},
	
	async: function (f, d)
	{
		this.cascade.add(f, d)
		this.setStatus('waiting')
	},
	
	wait: function (d)
	{
		var me = this
		this.cascade.add(function () { me.timedOut() }, d === undefined ? -1 : d)
		this.setStatus('waiting')
	},
	
	timedOut: function ()
	{
		this.fail('test timed out')
		this.done()
	},
	
	done: function ()
	{
		if (this.finished)
			return
		
		this.cascade.stop()
		
		var results = this.results, expect = this.conf.expect
		
		if (expect !== undefined && expect != results.length)
			this.fail(expect + ' expected but ' + results.length + ' run')
		
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
		this.parent.sigchild(this)
	},
	
	sigchild: function (test)
	{
		var status = test.status
		if (status === 'failed')
			this.fail()
		else if (status === 'passed')
			this.pass()
	},
	
	test: function (name, conf, callback)
	{
		if (arguments.length == 2)
		{
			callback = conf
			conf = undefined
		}
		else if (arguments.length == 1)
		{
			callback = name
			conf = undefined
			name = undefined
		}
		
		if (typeof callback !== 'function')
			throw new Error('callback is not present')
		
		var reporter = this.reporter.create()
		var test = new Me(this, name, conf, callback)
		test.reporter = reporter
		
		this.cascade.add(test.cascade)
		test.run()
		
		return test
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
	failing: function (flag) { this.conf.failing = flag === undefined ? true : flag },
	mayFail: function (flag) { this.conf.mayFail = flag === undefined ? true : flag },
	
	pass: function (m, d)
	{
		this.results.push({status: 'passed', message: m, description: d})
		if (m || d)
			this.reporter.pass(m, d)
	},
	
	fail: function (m, d)
	{
		this.results.push({status: 'failed', message: m, description: d})
		if (m || d)
			this.reporter.fail(m, d)
	},
	
	setStatus: function (s)
	{
		this.status = s
		this.reporter.setStatus(s)
	}
}

var empty = function () {}, devNull =
{
	create: function () { return devNull },
	setStatus: empty, fail: empty, pass: empty, info: empty, summary: empty
}

})();
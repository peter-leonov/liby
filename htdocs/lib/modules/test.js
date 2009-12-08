;(function(){

var myName = 'Test', Me = self[myName] = function () {}
Me.prototype =
{
	status: 'new',
	finished: false,
	
	initialize: function (parent, name, reporter, conf, callback)
	{
		this.conf = conf || {}
		this.results = []
		this.status = 'initialized'
		
		this.parent = parent
		this.name = name || '(untitled)'
		this.reporter = reporter || devNull
		this.callback = callback
		
		var c = this.cascade = new Cascade()
		var me = this
		c.oncomplete = function () { me.done() }
		c.onerror = function (ex) { me.fail(ex.message, 'got an error form cascade') }
		
		reporter.name(name)
		
		return this
	},
	
	run: function (delay)
	{
		var me = this
		this.cascade.job = function () { me._run(me.callback) }
		this.cascade.run(delay)
	},
	
	_run: function (f)
	{
		try
		{
			f(this)
		}
		catch (ex)
		{
			this.fail([ex.message, ex.fileName, ex.lineNumber], 'got an exception')
		}
	},
	
	async: function (f, d)
	{
		this.cascade.add(f, d)
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
		
		this.setStatus(ok ? 'passed' : 'failed')
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
		var test = new Me()
		test.initialize(this, name, reporter, conf, callback)
		
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
	
	log: function (m) { this.reporter.log(m) },
	info: function (m) { this.reporter.info(m) },
	
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
	},
	
	
	ok: function (v, d)
	{
		if (v)
			this.pass([this.inspect(v), 'is true'], d)
		else
			this.fail([this.inspect(v), 'is not true'], d)
	},
	
	no: function (v, d)
	{
		if (!v)
			this.pass([this.inspect(v), 'is false'], d)
		else
			this.fail([this.inspect(v), 'is not false'], d)
	},
	
	eq: function (a, b, d)
	{
		if (a === b)
			this.pass([this.inspect(a), '===', this.inspect(b)], d)
		else
			this.fail([this.inspect(a), '!==', this.inspect(b)], d)
	},
	
	ne: function (a, b, d)
	{
		if (a !== b)
			this.pass([this.inspect(a), '!==', this.inspect(b)], d)
		else
			this.fail([this.inspect(a), '===', this.inspect(b)], d)
	},
	
	eqo: function (a, b, d)
	{
		if (this.inspect(a) === this.inspect(b))
			this.pass([this.inspect(a), '===', this.inspect(b)], d)
		else
			this.fail([this.inspect(a), '!==', this.inspect(b)], d)
	},
	
	neo: function (a, b, d)
	{
		if (this.inspect(a) !== this.inspect(b))
			this.pass([this.inspect(a), '!==', this.inspect(b)], d)
		else
			this.fail([this.inspect(a), '===', this.inspect(b)], d)
	},
	
	lt: function (a, b, d) { if (a >= b) this.fail(this.inspect(a) + ' >= ' + this.inspect(b), d) },
	lte: function (a, b, d) { if (a > b) this.fail(this.inspect(a) + ' > '  + this.inspect(b), d) },
	gte: function (a, b, d) { if (a < b) this.fail(this.inspect(a) + ' < '  + this.inspect(b), d) },
	gt: function (a, b, d) { if (a <= b) this.fail(this.inspect(a) + ' <= ' + this.inspect(b), d) },
	
	instance: function (a, b, d)
	{
		if (a instanceof b)
			this.pass([this.inspect(a), 'instanceof', this.inspect(b)], d)
		else
			this.fail([this.inspect(a), 'is not instanceof', this.inspect(b)], d)
	},
	
	notinstance: function (a, b, d)
	{
		if (!(a instanceof b))
			this.pass([this.inspect(a), 'is not instanceof', this.inspect(b)], d)
		else
			this.fail([this.inspect(a), 'instanceof', this.inspect(b)], d)
	},
	
	_times: {},
	time: function (name)
	{
		return this._times[name] = new Date()
	},
	
	timeEnd: function (name)
	{
		var diff = new Date() - this._times[name]
		this.info((name || 'time') + ': ' + diff + 'ms')
		return diff
	},
	
	speed: function (f)
	{
		var count = 1
		do
		{
			count *= 5
			var begin = new Date()
			for (var i = 0; i < count; i++)
				f()
			var diff = new Date() - begin
		}
		while (diff < 25)
		
		var speed = count * 1000 / diff
		return speed
	}
}

var empty = function () {}, devNull =
{
	create: function () { return devNull },
	setStatus: empty, fail: empty, pass: empty, info: empty, summary: empty
}

var escapeChars = {'"': '\\"', '\\': '\\\\', '\n': '\\n', '\r': '\\r', '\t': '\\t'}
function escapeString (str)
{
	return str.replace(/(["\\\n\r\t])/g, function (v) { return escapeChars[v] })
}

var level = 0, indc = '	'
function inspect (val)
{
	if (level++ > 10)
		throw new Error('inspecting too deep: ' + inspect.level)
	
	var res, ind = new Array(level).join(indc)
	try
	{
		switch (typeof val)
		{
			case 'string':
				res = '"' + escapeString(val) + '"'
				break
			case 'object':
				if (val === null)
				{
					res = 'null'
					break
				}
				else if (val.constructor === Array)
				{
					var elements = []
					for (var i = 0, il = val.length; i < il; i++)
						elements.push(inspect(val[i]))
					res = (level > 1 ? '\n\r' : '') + ind + '[\n\r' + ind + indc + elements.join(',\n\r' + ind + indc) + '\n\r' + ind + ']'
					break
				}
				else if (val.constructor === Object)
				{
					var elements = []
					for (var k in val)
						elements.push(inspect(k) + ': ' + inspect(val[k]))
					res = (level > 1 ? '\n\r' : '') + ind + '{\n\r' + ind + indc + elements.join(',\n\r' + ind + indc) + '\n\r' + ind + '}'
					break
				}
			default:
				res = String(val)
		}
	}
	catch (ex) { throw new Error('error inspecting "' + val + '":' + ex) }
	
	level--
	return res
}

Me.prototype.inspect = inspect


})();
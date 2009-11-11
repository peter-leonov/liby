;(function(){

var doc = document

function T (text) { return doc.createTextNode(text) }
function N (tag, cn, text)
{
	var node = doc.createElement(tag)
	if (cn !== undefined) node.className = cn
	if (text !== undefined) node.appendChild(T(text))
	return node
}

var myName = 'Tests', Me = self[myName] =
{
	onload: function ()
	{
		var outputNode = this.outputNode = N('ol')
		outputNode.id = 'tests-output'
		doc.body.appendChild(outputNode)
		
		this.summaryNode = this.outputNode.appendChild(N('h1', 'summary'))
		
		this.run()
	},
	
	
	jobs: [],
	job: function (f)
	{
		this.jobs.push(f)
	},
	
	tests: [],
	test: function (name, conf, callback)
	{
		if (arguments.length == 2)
		{
			callback = conf
			conf = undefined
		}
		
		if (typeof callback !== 'function')
			throw new Error('callback is not present')
		
		var node = this.outputNode.appendChild(N('li', 'test'))
		
		var test = new this.Test().initialize(this, node, name, callback)
		if (conf)
			test.conf = conf
		this.tests.push(test)
		return test
	},
	
	run: function ()
	{
		var jobs = this.jobs
		for (var i = 0; i < jobs.length; i++)
			jobs[i](this)
		
		var tests = this.tests
		for (var i = 0; i < tests.length; i++)
			tests[i].run()
	},
	
	finished: function ()
	{
		var tests = this.tests, unfinished = 0
		for (var i = 0; i < tests.length; i++)
			if (!tests[i].finished)
				unfinished++
		
		if (unfinished == 0)
			this.summary()
	},
	
	summary: function ()
	{
		var tests = this.tests, failed = 0, ignored = 0
		for (var i = 0; i < tests.length; i++)
			if (tests[i].status == 'failed')
				if (tests[i].conf.failing)
					ignored++
				else
					failed++
		
		this.summaryNode.appendChild(T('done: ' + this.tests.length + ', failed: ' + failed + (ignored ? ' (' + ignored + ' ignored)' : '')))
		this.outputNode.className += failed ? 'failed' : 'passed'
	}
}

window.onload = function () { Me.onload() }

var Test = Me.Test = function () {}
Test.prototype =
{
	status: 'new',
	finished: false,
	
	initialize: function (parent, node, name, callback)
	{
		this.conf = {}
		this.results = []
		this.status = 'initialized'
		
		this.parent = parent
		this.name = name
		this.callback = callback
		
		this.view = new Test.View().initialize(this, node)
		this.view.title(this.name)
		
		this.sched = new Scheduler().initialize()
		this.sched.parent = this
		var me = this
		this.sched.oncomplete = function () { me.done() }
		this.sched.onerror = function (ex) { me.fail(ex.message, 'got an error form scheduler') }
		
		return this
	},
	
	run: function ()
	{
		var me = this
		this.sched.add(function () { me._run(me.callback) })
	},
	
	_run: function (f)
	{
		try
		{
			f(this)
		}
		catch (ex)
		{
			this.fail(ex.message, 'got an exception')
		}
	},
	
	async: function (f, d)
	{
		this.sched.add(f, d)
	},
	
	wait: function (d)
	{
		var me = this
		this.sched.add(function () { me.timedOut() }, d === undefined ? -1 : d)
		this.setStatus('waiting')
	},
	
	timedOut: function ()
	{
		this.fail('test timed out')
		this.done()
	},
	
	done: function ()
	{
		this.sched.abort()
		
		var results = this.results,
			status = 'empty'
		
		if (results.length)
		{
			status = 'passed'
			for (var i = 0; i < results.length; i++)
				if (results[i].status == 'fail')
					status = 'failed'
		}
		
		this.setStatus(status)
		this.finished = true
		this.parent.finished(this)
	},
	
	
	log: function (m) { this.view.log(m) },
	info: function (m) { this.view.info(m) },
	
	pass: function (m, d)
	{
		this.results.push({status: 'pass', message: m, description: d})
		this.view.pass(m, d)
	},
	
	fail: function (m, d)
	{
		this.results.push({status: 'fail', message: m, description: d})
		this.view.fail(m, d)
	},
	
	setStatus: function (s)
	{
		this.status = s
		this.view.setStatus(s)
	},
	
	
	ok: function (v, d)
	{
		if (v)
			this.pass(this.inspect(v) + ' is true', d)
		else
			this.fail(this.inspect(v) + ' is not true', d)
	},
	
	no: function (v, d)
	{
		if (!v)
			this.pass(this.inspect(v) + ' is false', d)
		else
			this.fail(this.inspect(v) + ' is not false', d)
	},
	
	eq: function (a, b, d)
	{
		if (a === b)
			this.pass(this.inspect(a) + ' === ' + this.inspect(b), d)
		else
			this.fail(this.inspect(a) + ' !== ' + this.inspect(b), d)
	},
	ne: function (a, b, d) { if (a === b) this.fail(this.inspect(a) + ' === ' + this.inspect(b), d) },
	
	eqo: function (a, b, d) { if (this.inspect(a) !== this.inspect(b)) this.fail(this.inspect(a) + ' !== ' + this.inspect(b), d) },
	neo: function (a, b, d) { if (this.inspect(a) === this.inspect(b)) this.fail(this.inspect(a) + ' === ' + this.inspect(b), d) },
	
	lt: function (a, b, d) { if (a >= b) this.fail(this.inspect(a) + ' >= ' + this.inspect(b), d) },
	lte: function (a, b, d) { if (a > b) this.fail(this.inspect(a) + ' > '  + this.inspect(b), d) },
	gte: function (a, b, d) { if (a < b) this.fail(this.inspect(a) + ' < '  + this.inspect(b), d) },
	gt: function (a, b, d) { if (a <= b) this.fail(this.inspect(a) + ' <= ' + this.inspect(b), d) },
	
	
	_times: {},
	time: function (name)
	{
		return this._times[name] = new Date()
	},
	
	timeEnd: function (name)
	{
		var diff = new Date() - this._times[name]
		this.info(name + ': ' + diff + 'ms')
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

Test.View = function () {}
Test.View.prototype =
{
	initialize: function (parent, main)
	{
		this.parent = parent
		this.main = main
		this.output = main.appendChild(N('dl'))
		return this
	},
	
	title: function (name)
	{
		this.output.appendChild(N('dt', 'title', name))
	},
	
	setStatus: function (s)
	{
		var main = this.main
		if (this.lastStatus)
			main.className = main.className.replace(' ' + this.lastStatus + ' ', ' ' + s + ' ')
		else
			main.className += ' ' + s + ' '
		this.lastStatus = s
	},
	
	line: function (cn, m, desc)
	{
		var row = this.output.appendChild(N('dd', 'line ' + cn, desc ? desc + ': ' + m : m))
	},
	
	fail: function (m, d) { this.line('fail', m, d) },
	pass: function (m, d) { this.line('pass', m, d) },
	info: function (m, d) { this.line('info', m, d) },
	log:  function (m, d) { this.line('log', m, d) }
}

var Scheduler = Me.Scheduler = function () {}
Scheduler.prototype =
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

Test.prototype.inspect = inspect

var m, ua = navigator.userAgent

Me.ua =
	((m = /(MSIE) (\d+\.?\d*)/.exec(ua)) && m[0]) ||
	((m = /(Firefox)\/(\d+\.\d+)/.exec(ua)) && m[1]+' '+m[2]) ||
	((m = /(Opera)\/(\d+\.\d)/.exec(ua)) && m[1]+' '+m[2]) ||
	((m = /Version\/(\d+\.\d) (Safari)\//.exec(ua)) && m[2]+' '+m[1])

})();

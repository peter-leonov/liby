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
	nodes: {},
	onload: function ()
	{
		var main = this.nodes.main = N('div')
		main.id = 'tests-output'
		doc.body.appendChild(main)
		
		this.run()
	},
	
	
	test: function (f)
	{
		this.callback = f
	},
	
	run: function ()
	{
		var title = doc.getElementsByTagName('title')[0]
		var test = this.mainTest = new this.Test().initialize(this, title ? title.firstChild.nodeValue : 'main', null, this.callback)
		this.nodes.main.appendChild(test.view.nodes.main)
		test.run()
	},
	
	sigchild: function ()
	{
		log('all done')
	},
	
	summary: function ()
	{
		var tests = this.tests, failed = 0, ignored = 0, passed = 0
		for (var i = 0; i < tests.length; i++)
		{
			var test = tests[i]
			if (test.status == 'failed')
			{
				failed++
				if (test.conf.failing)
					ignored++
			}
			else if (test.status == 'passed')
				passed++
		}
		
		var nodes = this.nodes
		var text = [passed + ' passed']
		if (failed)
			text.push(failed + ' failed')
		if (ignored)
			text.push(ignored + ' ignored')
		if (this.total != this.tests.length)
			text.push(this.total + ' of ' + this.tests.length + ' done')
		
		nodes.head.firstChild.nodeValue = text.join(', ') + '.'
		
		nodes.main.className += 'done' + (failed > ignored ? ' failed' : (passed ? ' passed' : ''))
	}
}

window.onload = function () { Me.onload() }

var Test = Me.Test = function () {}
Test.prototype =
{
	status: 'new',
	finished: false,
	
	initialize: function (parent, name, callback)
	{
		this.conf = {}
		this.results = []
		this.status = 'initialized'
		
		this.parent = parent
		this.name = name
		this.callback = callback
		
		this.view = new Test.View().initialize(this.name)
		
		var c = this.cascade = new Cascade()
		// c.parent = this
		var me = this
		c.oncomplete = function () { me.done() }
		c.onerror = function (ex) { me.fail(ex.message, 'got an error form cascade') }
		
		return this
	},
	
	run: function (delay)
	{
		var me = this
		this.cascade.add(function () { me._run(me.callback) }, delay)
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
		this.cascade.stop()
		
		var results = this.results, expect = this.conf.expect,
			status = 'empty'
		
		if (expect !== undefined)
			if (expect == results.length)
				status = 'passed'
			else
				this.fail(expect + ' expected but ' + results.length + ' run')
		
		if (results.length)
		{
			status = 'passed'
			for (var i = 0; i < results.length; i++)
				if (results[i].status == 'fail')
					status = 'failed'
		}
		
		this.setStatus(status)
		this.finished = true
		this.parent.sigchild(this)
	},
	
	sigchild: function (test)
	{
		log(test.name, test)
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
			name = '(untitled)'
		}
		
		if (typeof callback !== 'function')
			throw new Error('callback is not present')
		
		var test = new Test()
		test.initialize(this, name, callback)
		if (conf)
			test.conf = conf
		
		this.view.nodes.output.appendChild(test.view.nodes.main)
		this.cascade.add(test.cascade)
		test.run()
		
		return test
	},
	
	
	expect: function (amount) { this.conf.expect = amount },
	
	log: function (m) { this.view.log(m) },
	info: function (m) { this.view.info(m) },
	
	pass: function (m, d)
	{
		this.results.push({status: 'pass', message: m, description: d})
		if (m || d)
			this.view.pass(m, d)
	},
	
	fail: function (m, d)
	{
		this.results.push({status: 'fail', message: m, description: d})
		if (m || d)
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
	initialize: function (name)
	{
		var nodes = this.nodes = {}
		
		nodes.main = N('dl', 'test')
		nodes.head = nodes.main.appendChild(N('dt', 'head', name))
		nodes.body = nodes.main.appendChild(N('dt', 'body'))
		nodes.output = nodes.body.appendChild(N('ol'))
		
		return this
	},
	
	setStatus: function (s)
	{
		var main = this.nodes.main
		if (this.lastStatus)
			main.className = main.className.replace(' ' + this.lastStatus, ' ' + s)
		else
			main.className += ' ' + s
		this.lastStatus = s
	},
	
	line: function (cn, m, desc)
	{
		var row = this.nodes.output.appendChild(N('li', 'line ' + cn))
		
		if (desc !== undefined)
			row.appendChild(T(desc + ': '))
		
		if (m.constructor === Array)
		{
			for (var i = 0; i < m.length; i++)
			{
				var elem = m[i]
				// if (elem)
				row.appendChild(T(elem + ' '))
			}
		}
		else
			row.appendChild(T(m))
	},
	
	fail: function (m, d) { this.line('fail', m, d) },
	pass: function (m, d) { this.line('pass', m, d) },
	info: function (m, d) { this.line('info', m, d) },
	log:  function (m, d) { this.line('log', m, d) }
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


var s = self
if (!self.log)
{
	if (s.console && s.console.firebug)
		s.log = console.log
	else if (s.opera && s.opera.postError)
		s.log = function () { return s.opera.postError(arguments) }
	else if (s.console && s.console.log)
		s.log = function () { return s.console.log(Array.prototype.slice.call(arguments).join(', ')) }
	else
		s.log = function () {}
}


var m, ua = navigator.userAgent

Me.ua =
	((m = /(MSIE) (\d+\.?\d*)/.exec(ua)) && m[0]) ||
	((m = /(Firefox)\/(\d+\.\d+)/.exec(ua)) && m[1]+' '+m[2]) ||
	((m = /(Opera)\/(\d+\.\d)/.exec(ua)) && m[1]+' '+m[2]) ||
	((m = /Version\/(\d+\.\d) (Safari)\//.exec(ua)) && m[2]+' '+m[1])

})();
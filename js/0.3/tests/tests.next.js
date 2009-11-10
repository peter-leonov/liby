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
		
		this.run()
	},
	
	
	jobs: [],
	job: function (f)
	{
		this.jobs.push(f)
	},

	run: function ()
	{
		var jobs = this.jobs
		for (var i = 0; i < jobs.length; i++)
			jobs[i](this)
		
		this.next()
	},
	
	tests: [],
	test: function (name, callback)
	{
		if (typeof callback !== 'function')
			throw new Error('callback is not present')
		var node = this.outputNode.appendChild(N('li', 'test')),
			test = new this.Test().initialize(this, node, name, callback)
		this.tests.push(test)
		return test
	},
	
	
	current: 0,
	next: function ()
	{
		var test = this.tests[this.current++],
			me = this
		
		if (test)
			test.run()
		else
			setTimeout(function () { me.summary() }, 0)
	},
	
	
	summary: function ()
	{
		// this.log('done: ' + this.done + ', failed: ' + this.failed)
		this.outputNode.className += this.failed ? 'failed' : 'passed'
	}
}

window.onload = function () { Me.onload() }

var Test = Me.Test = function () {}
Test.prototype =
{
	status: 'new',
	
	initialize: function (parent, node, name, callback)
	{
		this.results = []
		this.status = 'initialized'
		
		this.parent = parent
		this.name = name
		this.callback = callback
		
		this.view = new Test.View()
		this.view.initialize(this, node)
		this.view.title(this.name)
		
		return this
	},
	
	// nwait: 0,
	// async: function (callback, timeout)
	// {
	// 	var me = this
	// 	function run ()
	// 	{
	// 		if (callback(me.kit) !== false)
	// 		{
	// 			me.nwait--
	// 			me.next()
	// 		}
	// 	}
	// 	this.nwait++
	// 	if (this.next.sync)
	// 		run()
	// 	else
	// 		setTimeout(run, timeout || 0)
	// },
	
	run: function ()
	{
		var me = this
		setTimeout(function () { me._run() }, 0)
	},
	
	_run: function ()
	{
		try
		{
			this.callback(this)
		}
		catch (ex)
		{
			this.fail(ex.message, 'got exception')
		}
		
		if (!this.timer)
			this.report()
	},
	
	async: function (f)
	{
		setTimeout(f, 1)
		this.wait()
	},
	
	wait: function (t)
	{
		if (this.timer)
			clearTimeout(this.timer)
		
		if (t)
		{
			var me = this
			this.timer = setTimeout(function () { me.timedOut() }, t * 1000)
		}
		
		this.setStatus('waiting')
	},
	
	timedOut: function ()
	{
		delete this.timer
		this.fail('test timed out')
		this.report()
	},
	
	done: function ()
	{
		if (this.timer)
			clearTimeout(this.timer)
		delete this.timer
		
		this.report()
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
	
	report: function ()
	{
		var results = this.results,
			status = 'passed'
		for (var i = 0; i < results.length; i++)
			if (results[i].status == 'fail')
				status = 'failed'
		
		this.setStatus(status)
		this.parent.next()
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

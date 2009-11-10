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
		var callback = this.callback,
			me = this
		if (callback)
		{
			function run ()
			{
				try { callback(me) }
				catch (ex)
				{
					me.fail('exception raised', ex.message)
					me.failed()
					return
				}
				me.passed()
			}
			setTimeout(run, 0)
		}
		else
		{
			this.fail('no callback present')
			this.failed()
		}
			
	},
	
	done: function ()
	{
		
	},
	
	wait: function (t)
	{
		log('wait ' + t)
	},
	
	
	failed: function ()
	{
		this.status = 'failed'
		this.view.failed()
		this.parent.next()
	},
	
	passed: function ()
	{
		this.status = 'passed'
		this.view.passed()
		this.parent.next()
	},
	
	
	
	log: function (m) { this.view.log(m) },
	info: function (m) { this.view.info(m) },
	fail: function (m, d)
	{
		this.results.push({status: 'fail', message: m, description: d})
		this.view.fail(m, d)
	},
	
	ok: function (v, d) { if (!v) this.fail(m, 'false: ' + this.inspect(v)) },
	no: function (v, d) { if (v)  this.fail(m, 'true: '  + this.inspect(v)) },
	
	eq: function (a, b, d) { if (a !== b) this.fail(this.inspect(a) + ' !== ' + this.inspect(b), d) },
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
	
	line: function (cn, m, desc)
	{
		var row = this.output.appendChild(N('dd', 'line ' + cn, m))
		if (desc)
			row.appendChild(N('pre', 'description', desc))
	},
	
	failed: function () { this.main.className += ' failed' },
	passed: function () { this.main.className += ' passed' },
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

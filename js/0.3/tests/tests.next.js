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
		var outputNode = this.outputNode = N('ul')
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
		var node = this.outputNode.appendChild(N('li')),
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
	
	
	info: function (m, d) { this.node('info', m, d, false) },
	log: function (m, d) { this.node('log', m, d, false) },
	summary: function ()
	{
		this.log('done: ' + this.done + ', failed: ' + this.failed)
		this.outputNode.className += this.failed ? 'failed' : 'passed'
	}
}

window.onload = function () { Tests.onload() }

Tests.Test = function () {}
Tests.Test.prototype =
{
	initialize: function (parent, node, name, callback)
	{
		this.node = node
		this.parent = parent
		this.name = name
		this.callback = callback
		this.results = []
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
				try
				{
					callback(me)
					// me.pass(callback.testName)
				}
				catch (ex)
				{
					me.fail(callback.testName, ex.message)
				}
			}
			setTimeout(run, 0)
		}
		else
			this.fail('no callback present')
	},
	
	wait: function (t)
	{
		log('wait ' + t)
	},
	
	
	fail: function (m, d)
	{
		this.done++
		this.failed++
		this.node('fail', m, d)
	},
	
	pass: function (m, d)
	{
		this.done++
		this.node('pass', m, d)
	},
	
	node: function (cn, m, desc, list)
	{
		var row = doc.createElement(list !== false ? 'li' : 'div')
		row.className = 'result ' + cn
		row.appendChild(doc.createTextNode(m))
		if (desc)
		{
			var d = doc.createElement('pre')
			d.className = 'description'
			d.appendChild(doc.createTextNode(desc))
			row.appendChild(d)
		}
		this.outputNode.appendChild(row)
	},
	
	
	info: function (m, d) { this.parent.info(m, d) },
	log: function (m, d) { this.parent.log(m, d) },
	fail: function (m, d) { this.results.push({status: 'fail', message: m, description: d}) },
	
	ok: function (v, d) { if (!v) this.fail(m, 'false: ' + inspect(v)) },
	no: function (v, d) { if (v)  this.fail(m, 'true: '  + inspect(v)) },
	
	eq: function (a, b, d) { if (a !== b) this.fail(inspect(a) + ' !== ' + inspect(b), d) },
	ne: function (a, b, d) { if (a === b) this.fail(inspect(a) + ' === ' + inspect(b), d) },
	
	eqo: function (a, b, d) { if (inspect(a) !== inspect(b)) this.fail(inspect(a) + ' !== ' + inspect(b), d) },
	neo: function (a, b, d) { if (inspect(a) === inspect(b)) this.fail(inspect(a) + ' === ' + inspect(b), d) },
	
	lt: function (a, b, d) { if (a >= b) this.fail(inspect(a) + ' >= ' + inspect(b), d) },
	lte: function (a, b, d) { if (a > b) this.fail(inspect(a) + ' > '  + inspect(b), d) },
	gte: function (a, b, d) { if (a < b) this.fail(inspect(a) + ' < '  + inspect(b), d) },
	gt: function (a, b, d) { if (a <= b) this.fail(inspect(a) + ' <= ' + inspect(b), d) },
	
	
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
		// this.log('~ ' + Math.round(speed) + ' circles per second')
		return speed
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


var m, ua = navigator.userAgent

Me.ua =
	((m = /(MSIE) (\d+\.?\d*)/.exec(ua)) && m[0]) ||
	((m = /(Firefox)\/(\d+\.\d+)/.exec(ua)) && m[1]+' '+m[2]) ||
	((m = /(Opera)\/(\d+\.\d)/.exec(ua)) && m[1]+' '+m[2]) ||
	((m = /Version\/(\d+\.\d) (Safari)\//.exec(ua)) && m[2]+' '+m[1])

})();

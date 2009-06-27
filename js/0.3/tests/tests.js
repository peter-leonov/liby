;(function(){

var doc = document, outputNode

function startup ()
{
	outputNode = doc.createElement('ul')
	outputNode.id = 'tests-output'
	document.body.appendChild(outputNode)
}

function node (cn, m, desc, list)
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
	outputNode.appendChild(row)
}

var escapeChars = {'"': '\\"', '\\': '\\\\', '\n': '\\n', '\r': '\\r', '\t': '\\t'}
function escapeString (str)
{
	return str.replace(/(["\\\n\r\t])/g, function (v) { return escapeChars[v] })
}

function inspect (val)
{
	if (inspect.level > 3)
		return
	try
	{
	switch (typeof val)
	{
		case 'number':
			return '' + val
		case 'string':
			return '"' + escapeString(val) + '"'
		case 'object':
			if (val === null)
				return 'null'
			var elements = []
			inspect.level++
			if (val.constructor === Array)
				for (var i = 0, il = val.length; i < il; i++)
					elements.push(inspect(val[i]))
			else if (val.constructor === Object)
				for (var k in val)
					elements.push(escapeString(k) + ': ' + inspect(val[k]))
			else
				return String(val)
			inspect.level--
			return elements.join(', ')
	}
	}
	catch (ex) { return 'error inspecting "' + val + '":' + ex }
	
}
inspect.level = 0

window.addEventListener('load', startup, false)

var times = {}

var myName = 'tests', Me = self[myName] =
{
	planed: 0,
	tests: 0,
	fails: 0,
	skiped: 0,
	skips: [],
	
	plan: function (planed, skips)
	{
		this.planed = planed
		if (skips)
			this.skip(skips)
	},
	skip: function (s)
	{
		var skips = this.skips || (this.skips = {})
		for (var i = 0; i < s.length; i++)
			skips[s[i]] = true
	},
	
	fail: function (m, d)
	{
		this.tests++
		if (this.skips['*'] || this.skips[this.tests])
		{
			this.skiped++
			node('skip', m, d)
		}
		else
		{
			this.fails++
			node('fail', m, d)
		}
	},
	
	success: function (m, d)
	{
		this.tests++
		node('success', m, d)
	},
	
	info: function (m, d) { node('info', m, d, false) },
	log: function (m, d) { node('log', m, d, false) },
	
	eq: function (a, b, m, s) { a === b ? this.success(m) : this.fail(m, inspect(a) + ' !== ' + inspect(b), s) },
	ne: function (a, b, m, s) { a !== b ? this.success(m) : this.fail(m, inspect(a) + ' === ' + inspect(b), s) },
	eqarr: function (a, b, m, s)
	{
		good:
		{
			if (a.length !== b.length)
				break good
			for (var i = 0; i < a.length; i++)
				if (!(a[i] === b[i]))
					break good
			
			return this.success(m)
		}
		
		this.fail(m, 'a: ' + inspect(a) + '\n\rb: ' + inspect(b), s)
	},
	ok: function (v, m, s) { v ? this.success(m) : this.fail(m, '"' + v + '"', s) },
	
	
	time: function (name)
	{
		return times[name] = new Date()
	},
	
	timeEnd: function (name)
	{
		var date = new Date(),
			diff = date - times[name]
		this.info(name + ': ' + diff + 'ms')
		return diff
	},
	
	done: function ()
	{
		this.log('done: ' + this.tests + ', planed: ' + this.planed + ', failed: ' + this.fails + ', skiped: ' + this.skiped)
		outputNode.className += this.fails || this.planed > 0 && this.tests !== this.planed ? 'failed' : 'successful'
	}
}

var m, ua = navigator.userAgent

Me.ua =
	((m = /(MSIE) (\d+\.?\d*)/.exec(ua)) && m[0]) ||
	((m = /(Firefox)\/(\d+\.\d+)/.exec(ua)) && m[1]+' '+m[2]) ||
	((m = /(Opera)\/(\d+\.\d)/.exec(ua)) && m[1]+' '+m[2]) ||
	((m = /Version\/(\d+\.\d) (Safari)\//.exec(ua)) && m[2]+' '+m[1])

})();

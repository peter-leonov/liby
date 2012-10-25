;(function(){

var doc = document, Label = Test.Label

function T (text) { return doc.createTextNode(text) }
function N (tag, cn, text)
{
	var node = doc.createElement(tag)
	if (cn !== undefined) node.className = cn
	if (text !== undefined) node.appendChild(T(text))
	return node
}

function Object_diff (a, b) // Object.diff copy-n-paste
{
	var add = {}, change = {}, remove = {}, total = 0
	
	if (a !== b)
	{
		for (var k in b)
			if (k in a)
			{
				if (a[k] !== b[k])
				{
					change[k] = b[k]
					total++
				}
			}
			else
			{
				add[k] = b[k]
				total++
			}
		
		for (var k in a)
			if (!(k in b))
			{
				remove[k] = a[k]
				total++
			}
	}
	
	return {add: add, change: change, remove: remove, total: total}
}

function Object_copy (s) // Object.copy copy-n-paste
{
	var d = {}
	for (var k in s)
		d[k] = s[k]
	return d
}

function Object_keys (s) // Object.keys copy-n-paste
{
	var r = []
	for (var k in s)
		r.push(k)
	return r
}



var myName = 'Tests', Me =
{
	maxLabelLength: 100,
	ignoredGlobals: ['sessionStorage', 'localStorage'],
	nodes: {},
	load: function ()
	{
		var main = this.nodes.main = N('div')
		main.id = 'tests-output'
		doc.body.appendChild(main)
		
		this.run()
	},
	onload: function () { Me.load() },
	
	ignoreGlobals: function (ary)
	{
		this.ignoredGlobals = this.ignoredGlobals.concat(ary)
	},
	
	drawWindowDiff: function ()
	{
		var old = this.windowSnapshot
		var now = Object_copy(window)
		
		var ignore = this.ignoredGlobals, ignoreByRegexp = []
		for (var i = 0, il = ignore.length; i < il; i++)
		{
			var k = ignore[i]
			
			if (k.constructor == RegExp)
			{
				ignoreByRegexp.push(k)
				continue
			}
			
			delete old[k]
			delete now[k]
		}
		
		for (var i = 0, il = ignoreByRegexp.length; i < il; i++)
		{
			var rex = ignoreByRegexp[i]
			
			for (var k in old)
				if (rex.test(k))
					delete old[k]
			
			for (var k in now)
				if (rex.test(k))
					delete now[k]
		}
		
		var diff = Object_diff(old, now)
		
		var tool = this.mainTest.tool
		
		var add = Object_keys(diff.add)
		if (add.length)
			tool.fail([add], 'global variables added')
		
		var rem = Object_keys(diff.remove)
		if (rem.length)
			tool.fail([rem], 'global variables removed')
		
		var cng = Object_keys(diff.change)
		if (cng.length)
			tool.warn([cng], 'global variables altered')
	},
	
	test: function (f)
	{
		this.callback = f
		window.onload = this.onload
	},
	
	run: function ()
	{
		try { var title = doc.getElementsByTagName('title')[0].firstChild.nodeValue }
		catch (ex) { title = 'main' }
		
		this.windowSnapshot = Object_copy(window)
		
		var test = this.mainTest = new Test(this, title, null, this.callback)
		test.holder = window
		var me = this
		test.onbeforecomplete = function () { me.onbeforecomplete() }
		
		var reporter = test.reporter = new Reporter(test.holder, test)
		this.nodes.main.appendChild(reporter.nodes.main)
		
		test.run()
		
		var hide = reporter.nodes.head.appendChild(N('button', 'hide', 'hide'))
		hide.onclick = function () { reporter.hide() }
	},
	
	childTest: function ()
	{
		this.nodes.main.className += 'done'
		this.oncomplete()
	},
	
	onbeforecomplete: function ()
	{
		this.drawWindowDiff()
	},
	
	oncomplete: function () {},
	
	// ignore raw sigchilds
	sigchild: function () {}
}

Me.className = myName
self[myName] = Me

var Reporter = function (holder, parent)
{
	var nodes = this.nodes = {}
	
	this.holder = holder
	this.parent = parent
	
	nodes.main = N('dl', 'test')
	nodes.head = nodes.main.appendChild(N('dt', 'head'))
	nodes.summary = nodes.main.appendChild(N('dt', 'summary'))
	nodes.body = nodes.main.appendChild(N('dt', 'body'))
	nodes.output = nodes.body.appendChild(N('ol'))
}

Reporter.prototype =
{
	create: function (holder, parent)
	{
		var reporter = new Reporter(holder, parent)
		this.node(reporter.nodes.main)
		return reporter
	},
	
	name: function (name)
	{
		this.nodes.head.appendChild(T(name))
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
	
	hide: function ()
	{
		this.nodes.main.style.display = 'none'
	},
	
	summary: function (text)
	{
		this.nodes.summary.appendChild(T(text))
	},
	
	node: function (node)
	{
		var row = this.nodes.output.appendChild(N('li', 'line'))
		row.appendChild(node)
	},
	
	makeLablel: function (v)
	{
		var label = String(v),
			ml = this.maxLabelLength
		return label.length > ml ? label.substr(0, ml) + ' …' : label
	},
	
	inspect: function (v)
	{
		var link = N('a')
		link.onclick = (function (v) { return function () { (console.dir || console.log)(v) } })(v)
		var inspector = new Test.Inspector()
		link.appendChild(T(this.makeLablel(inspector.inspect(v))))
		return link
	},
	
	line: function (cn, m, d)
	{
		var row = this.nodes.output.appendChild(N('li', 'line ' + cn))
		
		if (d !== undefined)
			row.appendChild(T(d + ': '))
		
		if (!m || typeof m != 'object' || m.constructor != Array)
			m = [m]
		
		for (var i = 0; i < m.length; i++)
		{
			var v = m[i]
			
			if (v instanceof Label)
				row.appendChild(N('span', v.className, v.text))
			else
				row.appendChild(this.inspect(m[i]))
			row.appendChild(T(' '))
		}
	},
	
	warn: function (m, d) { this.line('warn', m, d) },
	fail: function (m, d) { this.line('fail', m, d) },
	pass: function (m, d) { this.line('pass', m, d) },
	info: function (m, d) { this.line('info', m, d) },
	log:  function (m, d) { this.line('log', m, d) }
}

Reporter.className = 'Reporter'


;(function(){

var s = self

if (!s.log)
{
	// console object present
	if (s.console)
		s.log = function () { s.console.log.apply(s.console, arguments) }
	
	// Opera
	else if (s.opera && s.opera.postError)
		s.log = function () { return s.opera.postError(arguments) }
	
	// none
	else
		s.log = function () {}
}

})();

var m, ua = navigator.userAgent

Me.ua =
	((m = /(MSIE) (\d+\.?\d*)/.exec(ua)) && m[0]) ||
	((m = /(Firefox)\/(\d+\.\d+)/.exec(ua)) && m[1]+' '+m[2]) ||
	((m = /(Chrome)\/(\d+\.\d+)/.exec(ua)) && m[1]+' '+m[2]) ||
	((m = /(Opera)\/(\d+\.\d)/.exec(ua)) && m[1]+' '+m[2]) ||
	((m = /Version\/(\d+\.\d) (Safari)\//.exec(ua)) && m[2]+' '+m[1])

})();

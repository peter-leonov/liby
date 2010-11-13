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

var myName = 'Tests', Me =
{
	maxLabelLength: 100,
	nodes: {},
	load: function ()
	{
		var main = this.nodes.main = N('div')
		main.id = 'tests-output'
		doc.body.appendChild(main)
		
		this.run()
	},
	onload: function () { Me.load() },
	
	oncomplete: function () {},
	
	test: function (f)
	{
		this.callback = f
		if (window.addEventListener)
			window.addEventListener('load', this.onload, false)
		else
			window.onload = this.onload
	},
	
	run: function ()
	{
		try { var title = doc.getElementsByTagName('title')[0].firstChild.nodeValue }
		catch (ex) { title = 'main' }
		
		var test = this.mainTest = new Test(this, title, null, this.callback)
		test.holder = window
		
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
	((m = /(Chrome)\/(\d+\.\d+)/.exec(ua)) && m[1]+' '+m[2]) ||
	((m = /(Opera)\/(\d+\.\d)/.exec(ua)) && m[1]+' '+m[2]) ||
	((m = /Version\/(\d+\.\d) (Safari)\//.exec(ua)) && m[2]+' '+m[1])

})();

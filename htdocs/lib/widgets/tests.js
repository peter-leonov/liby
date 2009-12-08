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
	
	oncomplete: function () {},
	
	test: function (f)
	{
		this.callback = f
	},
	
	run: function ()
	{
		try { var title = doc.getElementsByTagName('title')[0].firstChild.nodeValue }
		catch (ex) { title = 'main' }
		
		var reporter = new Reporter().initialize()
		this.nodes.main.appendChild(reporter.nodes.main)
		
		var test = this.mainTest = new Test().initialize(this, title, reporter, null, this.callback)
		test.run()
	},
	
	sigchild: function ()
	{
		this.nodes.main.className += 'done'
		this.oncomplete()
	}
}

window.onload = function () { Me.onload() }


var Reporter = function () {}
Reporter.prototype =
{
	initialize: function (name)
	{
		var nodes = this.nodes = {}
		
		nodes.main = N('dl', 'test')
		nodes.head = nodes.main.appendChild(N('dt', 'head', name))
		nodes.summary = nodes.main.appendChild(N('dt', 'summary'))
		nodes.body = nodes.main.appendChild(N('dt', 'body'))
		nodes.output = nodes.body.appendChild(N('ol'))
		
		return this
	},
	
	create: function ()
	{
		var reporter = new Reporter().initialize()
		this.nodes.main.appendChild(reporter.nodes.main)
		return reporter
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
	
	summary: function (text)
	{
		this.nodes.summary.appendChild(T(text))
	},
	
	node: function (node)
	{
		var row = this.nodes.output.appendChild(N('li', 'line'))
		row.appendChild(node)
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

if (!Array.prototype.indexOf)
Array.prototype.indexOf = function(v, i)
{
	var len = this.length,
		i = N(i) || 0
	i = (i < 0) ? (Math.ceil(i) + len) : Math.floor(i)

	for (; i < len; i++)
		if (i in this && this[i] === v)
			return i
	return -1
}


var m, ua = navigator.userAgent

Me.ua =
	((m = /(MSIE) (\d+\.?\d*)/.exec(ua)) && m[0]) ||
	((m = /(Firefox)\/(\d+\.\d+)/.exec(ua)) && m[1]+' '+m[2]) ||
	((m = /(Opera)\/(\d+\.\d)/.exec(ua)) && m[1]+' '+m[2]) ||
	((m = /Version\/(\d+\.\d) (Safari)\//.exec(ua)) && m[2]+' '+m[1])



})();

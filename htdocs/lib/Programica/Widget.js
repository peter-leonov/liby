
self.addEventListener('load', function () { Programica.Widget.onLoader() }, false)

Programica.Widget = function () {}
Object.extend (Programica.Widget,
{
	registered: [],
	
	register: function (wgt)
	{
		this.registered.push(wgt)
	},
	
	sortby:
	{
		pri: function (a,b) { return a.pri - b.pri }
	},
	
	// search for widget nodes, sort it and call bind for each
	onLoader: function ()
	{
		if (this.thinkLoaded) return
		this.thinkLoaded = true
		
		// search notes into stack
		var stack = [];
		for (var wi in this.registered)
		{
			var w = this.registered[wi]
			
			var nodes = []
			if (w.mainNodeClassName)
				nodes = document.getElementsByClassName(w.mainNodeClassName)
			if (w.mainNodeTagName)
				nodes = document.getElementsByTagName(w.mainNodeTagName)
			
			for (var ni = 0; ni < nodes.length; ni++)
				stack.push
				(
					{
						w:w,
						node:nodes[ni],
						pri: (nodes[ni].getAttribute('pmc-widget-priority') || 0)
					}
				)
		}
		
		
		// sorting
		this.sorted = stack.sort(this.sortby.pri)
		
		for (var ni = 0; ni < this.sorted.length; ni++)
		{
			var n = this.sorted[ni]
			n.w.bind(n.node)
		}
	},
	
	// play in threads
	initJob: function ()
	{
		// bind
		for (var ni = 0; ni < this.sorted.length; ni++)
		{
			var n = this.sorted[ni]
			if (n.bint || n.error) continue
			
			try
			{
				n.w.bind(n.node)
			}
			catch (ex)
			{
				n.bint = false
				n.error = true
				
				throw ex
			}
			
			n.bint = true
			return
		}
		clearInterval(this.initInterval)
	}
})


// widgets base class
Programica.Widget.prototype =
{
	klass: 'Programica.Widget',
	bind: function (node) { (new this.Handler(node)).init() },
	toString: function () { return '[object ' + this.klass + ']' }
}

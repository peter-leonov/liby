
window.addEventListener('load', function () { Programica.Widget.onLoader() }, false)

// спомогательный интерфейс для организации виджетов

Programica.Widget = function () {}
extend (Programica.Widget,
{
	registered: [],
	
	register: function (wgt)
	{
		this.registered.push(wgt)
	},
	
	sortby:
	{
		pri: function () {  }
	},
	
	// ищет ноды для виджетов, ранжирует и вызывает bind для каждой
	onLoader: function ()
	{
		/*var all = document.getElementsByClassName('programica-rolling-images')
		
		for (var i = 0; i < all.length; i++)
			this.bind(all[i])*/
		
		var stack = [];
		
		for (var wi in this.registered)
		{
			var w = this.registered[wi]
			
			var nodes = document.getElementsByClassName(w.mainNodeClassName)
			for (var ni = 0; ni < nodes.length; ni++)
				stack.push({w:w, node:nodes[ni], pri:(nodes[ni].getAttribute('widget-priority') || 0)})
		}
		
		log(stack.sort(this.sortby.pri))
	}
})


// базовый класс виджетов

Programica.Widget.prototype =
{
	bind: function (node)
	{
		/*node.pmc || (node.pmc = {})
		
		node.pmc[this] = new this.Handler(node);
		node.pmc[this].init()*/
		(new this.Handler(node)).init()
	}
}

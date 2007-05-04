
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
		pri: function (a,b) { return a.pri - b.pri }
	},
	
	// ищет ноды для виджетов, ранжирует и вызывает bind для каждой
	onLoader: function ()
	{
		// ищем все ноды в stack
		var stack = [];
		for (var wi in this.registered)
		{
			var w = this.registered[wi]
			
			var nodes = document.getElementsByClassName(w.mainNodeClassName)
			for (var ni = 0; ni < nodes.length; ni++)
				stack.push({w:w, node:nodes[ni], pri:(nodes[ni].getAttribute('widget-priority') || 0)})
		}
		
		log("Registered widgets: ", this.registered)
		
		// ранжируем
		this.sorted = stack.sort(this.sortby.pri)
		
		// Пришлось усложнить механизм инициализации.
		// Суть в том, что брузеры (фф, ие) не создают ноды в дереве
		// до тех пор, пока яваскрипт не выполнится до конца.
		// Некоторые скрипты могут создавать ноды, на которые потом
		// рассчитывают другие скрипты
		this.sorted_rinning = this.sorted
		var t = this
		// интервал на спасет
		this.initInterval = setInterval(function () { t.initThread() }, 50)
	},
	
	// поиграем в треды?
	initThread: function ()
	{
		// биндим
		for (var ni = 0; ni < this.sorted.length; ni++)
		{
			var n = this.sorted[ni]
			if (n.bint) continue
			log("Binding widget ", n.w, " to ", n.node)
			n.w.bind(n.node)
			n.bint = true
			log("... bint")
			return // мы же в "треде" :)
		}
	}
})


// базовый класс виджетов

Programica.Widget.prototype =
{
	klass: 'Programica.Widget',
	
	bind: function (node)
	{
		/*node.pmc || (node.pmc = {})
		
		node.pmc[this] = new this.Handler(node);
		node.pmc[this].init()*/
		(new this.Handler(node)).init()
	},
	
	toString: function () { return '[object ' + this.klass + ']' }
}

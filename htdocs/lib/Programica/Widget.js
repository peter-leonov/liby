
self.addEventListener('load', function () { Programica.Widget.onLoader() }, false)

// вспомогательный интерфейс для организации виджетов

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
		if (this.thinkLoaded) return
		this.thinkLoaded = true
		
		log2("Registered widgets: ", this.registered)
		
		// ищем все ноды в stack
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
		
		
		// ранжируем
		this.sorted = stack.sort(this.sortby.pri)
		
		if (this.asyncBind)
		{
			// Пришлось усложнить механизм инициализации.
			// Суть в том, что иногда брузеры (фф, ие) не создают ноды в дереве
			// до тех пор, пока яваскрипт не выполнится до конца.
			// Некоторые скрипты могут создавать ноды, на которые потом
			// рассчитывают другие скрипты
			// таймер нас спасет
			var t = this
			this.initInterval = setInterval(function () { t.initJob() }, 10)
		}
		else
		{
			for (var ni = 0; ni < this.sorted.length; ni++)
			{
				var n = this.sorted[ni]
				
				log2("Binding sync widget ", n.w, " to ", n.node)
				n.w.bind(n.node)
				log2("... bint")
			}
		}
	},
	
	// поиграем в треды?
	initJob: function ()
	{
		// биндим
		for (var ni = 0; ni < this.sorted.length; ni++)
		{
			var n = this.sorted[ni]
			if (n.bint || n.error) continue
			log("Binding async widget ", n.w, " to ", n.node)
			
			// блокировки не организовываем в рассчете на то,
			// что в яваскриптах нет многопоточночти и события
			// прийдут точно одно за другим
			
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
			log("... bint")
			return // мы же в "треде" :)
		}
		clearInterval(this.initInterval)
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

log2("Programica/Widget.js loaded")
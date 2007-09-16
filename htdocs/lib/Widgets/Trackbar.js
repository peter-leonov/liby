
Programica.Trackbar = function () {}

Programica.Trackbar.prototype = new Programica.Widget()
Programica.Trackbar.prototype.mainNodeClassName = 'programica-trackbar'
Programica.Trackbar.prototype.klass = 'Programica.Trackbar'
Programica.Trackbar.prototype.Handler = function (node)
{
	this.mainNode = node
	this.mainNode.Trackbar = this
	
	this.dragger = this.my('dragger')[0]
	this.input = this.mainNode.getElementsByTagName('input')[0]
	
	if (!this.dragger)
	{
		log(this.mainNode)
		throw new Error('Trackbar has no dragger')
	}
	
	if (!this.input)
	{
		log(this.mainNode)
		throw new Error('Trackbar has no input')
	}
	
	var t = this
	
	this.mousedown_handler = function (e) { t.startdrag(e) }
	this.mousemove_handler = function (e) { t.dragging(e) }
	this.mouseup_handler = function (e) { t.stopdrag(e) }
	
	this.dragger.addEventListener('mousedown', this.mousedown_handler, false)
}

Programica.Trackbar.prototype.Handler.prototype =
{
	init:			function ()		{  },
	
	startdrag: function (e)
	{
		e.preventDefault()
		
		document.addEventListener('mousemove', this.mousemove_handler, false)
		document.addEventListener('mouseup', this.mouseup_handler, false)
		
		// takin maximum width and height in memory
		// to avoid (some times ritch) recalculating on each mouse move
		this.mw = this.mainNode.offsetWidth - this.dragger.offsetWidth
		this.mh = this.mainNode.offsetHeight - this.dragger.offsetHeight
		
		this.filter = this.mainNode.valueFilter
		
		// начальные координвты мышки и драггера
		this.di = {mx:e.clientX, my:e.clientY, sx:this.dragger.offsetLeft, sy:this.dragger.offsetTop}
	},
	
	dragging: function (e)
	{
		// не тащим, если потеряны начальные координаты
		if (!this.di)
			return
		
		
		
		// считаем смещение перетаскивания
		this.drag_dx = this.di.mx - e.clientX
		this.drag_dy = this.di.my - e.clientY
		
		// считаем смещения бегунка
		var left = this.di.sx - this.drag_dx
		var top = this.di.sy - this.drag_dy
		
		
		// границы по горизонтали
		if (left < 0)
			left = 0
		else if (left >= this.mw)
			left = this.mw
		
		// границы по вертикали
		if (top < 0)
			top = 0
		else if (top >= this.mh)
			top = this.mh
		
		
		// перемещаем
		this.dragger.style.left = left + 'px'
		//this.dragger.style.top = top + 'px'
		
		var v = left / this.mw
		
		
		// выполняем преобразование
		if (this.filter)
			v = this.filter(v)
		else
			v = Math.round(v*100)
		
		
		// обновляем инпут
		this.input.value = v
	},
	
	stopdrag: function (e)
	{
		document.removeEventListener('mousemove', this.mousemove_handler, false)
		document.removeEventListener('mouseup', this.mouseup_handler, false)
	},
	
	my: function (cn, node)
	{
		var root = (node || this.mainNode)
		cn = this.ns ? (this.ns + "-" + cn) : cn
		return (root && root.getElementsByClassName) ? root.getElementsByClassName(cn) : []
	},
}

Programica.Widget.register(new Programica.Trackbar())


log2("Widget/Trackbar.js loaded")

if (!window.Programica) Programica = {}

Programica.Fixes =
{
	all: function ()
	{
		this.runtimeStyle.behavior = 'none'
		
		this.onpropertychange = Programica.Fixes.onpropertychange
		
		Programica.Fixes.fixOpacity.apply(this)
		Programica.Fixes.fixPrototype.apply(this)
		Programica.Fixes.fixTitle.apply(this)
		
		if (/MSIE 6/.test(navigator.userAgent))
		{
			Programica.Fixes.fixPng.apply(this)
			Programica.Fixes.fixTitle.apply(this)
			Programica.Fixes.fixLabel.apply(this)
			
		}
		
		if (/MSIE 7/.test(navigator.userAgent))
		{
			Programica.Fixes.fixTitle.apply(this)
		}
	},
	
	onpropertychange: function (e)
	{
		
		if (event.propertyName == 'style.opacity')
		{
			//var str; for (var i in this) str += i + ' ' + this[i] + "\n"; alert(str)
			this.style.filter = "alpha(opacity=" + Math.round(this.style.opacity*100) + ",style=0)"
			this.style.zoom = 1
		}
	},
	
	//——————————————————————————————————————————————————————————————————————————
	
	fixOpacity: function ()
	{
		if (this.currentStyle.opacity)
			this.style.opacity = this.currentStyle.opacity
	},
	
	fixPng: function ()
	{
		if (this.tagName != 'IMG' || this.runtimeStyle.filter) return
		if (/\.png$/.test(this.src))
		{
			this.runtimeStyle.filter = "progid:DXImageTransform.Microsoft.AlphaImageLoader(src='" + this.src + "', sizingMethod='image')"
			this.setAttribute('src', '/lib/img/dot.gif')
		}
	},
	
	/* убирает лишние подсказки */
	fixTitle: function ()
	{
		if (!this.title) this.title = ''
	},
	
	/* делает кликабельными метки */
	fixLabel: function ()
	{
		var t = this
		this.attachEvent("onclick", function () { var node = t.getElementsByTagName('input')[0]; if (node) node.click() })
	},
	
	/* добавляет методы и свойства из HTMLElement.prototype */
	fixPrototype: function ()
	{
		if (!window.extend) return
		if (window.HTMLElement) extend(this, HTMLElement.prototype)
		if (window.HTMLFormElement && this.tagName == 'FORM') extend(this, HTMLFormElement.prototype)
	}
}


/* кривоватый фикс addEventListener(...) и preventDefault() для IE */
if (!window.addEventListener && window.attachEvent)
{
	HTMLElement.prototype.addEventListener = function (type, func, dir)
	{
		if (type == 'DOMMouseScroll')
			type = 'mousewheel'
		
		var t = this
		var newh = function (e)
		{
			e.preventDefault = function () { this.returnValue = false; return true }
			e.detail = -e.wheelDelta
			func.apply(t,[e])
		}
		this.attachEvent('on' + type, newh)
	},
	window.addEventListener = document.addEventListener = HTMLElement.prototype.addEventListener
}

document.write('<style> * { behavior: expression(Programica.Fixes.all.apply(this)) } </style>')
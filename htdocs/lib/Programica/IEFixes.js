
if (!window.Programica) Programica = {}

var alli = {}
var all = []
setInterval(function () { window.status = all; alli = {}; all = [] }, 3000)
Programica.Fixes =
{
	all: function ()
	{
		this.runtimeStyle.behavior = 'none'
		
		
		Programica.Fixes.fixPrototype.apply(this)
		
		if (/MSIE 6/.test(navigator.userAgent))
		{
			this.onpropertychange = Programica.Fixes.onpropertychange6
			
			Programica.Fixes.fixOpacity.apply(this)
			Programica.Fixes.fixPng.apply(this)
			Programica.Fixes.fixTitle.apply(this)
			Programica.Fixes.fixLabel.apply(this)
			Programica.Fixes.fixTitle.apply(this)
		}
		
		if (/MSIE 7/.test(navigator.userAgent))
		{
			this.onpropertychange = Programica.Fixes.onpropertychange7
			
			Programica.Fixes.fixOpacity.apply(this)
			Programica.Fixes.fixTitle.apply(this)
		}
	},
	
	onpropertychange6: function ()
	{
		if (!alli[event.propertyName+':'+event.type]) all.push(event.propertyName+':'+event.type), alli[event.propertyName+':'+event.type] = true
		if (event.propertyName == 'style.opacity')
		{
			this.style.filter = "alpha(opacity=" + Math.round(this.style.opacity * 100) + ")"
			this.style.zoom = 1
		}
		else if (event.propertyName == 'disabled')
			Programica.Fixes.fixDisabled.apply(this)
	},
	
	onpropertychange7: function ()
	{
		
		if (event.propertyName == 'style.opacity')
		{
			this.style.filter = "alpha(opacity=" + Math.round(this.style.opacity * 100) + ")"
			this.style.zoom = 1
		}
	},
	
	//——————————————————————————————————————————————————————————————————————————
	
	fixOpacity: function ()
	{
		if (this.currentStyle.opacity)
			this.style.opacity = this.currentStyle.opacity
	},
	
	fixDisabled: function ()
	{
		this.addClassName('disabled')
		this.disabled ? this.addClassName('disabled') : this.remClassName('disabled')
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


HTMLElement.prototype.disable = function ()
{
	this.setAttribute('disabled', true)
	this.addClassName('disabled')
}

HTMLElement.prototype.enable = function ()
{
	this.removeAttribute('disabled')
	this.remClassName('disabled')
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
			e.detail = - e.wheelDelta / 120
			func.apply(t,[e])
		}
		this.attachEvent('on' + type, newh)
	},
	window.addEventListener = document.addEventListener = HTMLElement.prototype.addEventListener
}

document.write('<style> * { behavior: expression(Programica.Fixes.all.apply(this)) } </style>')
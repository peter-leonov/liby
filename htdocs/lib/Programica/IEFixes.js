
if (!window.Programica) Programica = {}
if (!window.HTMLFormElement) window.HTMLFormElement = {prototype:{}}

Programica.IEFixes =
{
	all: function ()
	{
		this.runtimeStyle.behavior = 'none'
		
		Programica.IEFixes.fixPrototype.apply(this)
		
		if (/MSIE 6/.test(navigator.userAgent))
		{
			this.onpropertychange = Programica.IEFixes.onpropertychange6
			
			Programica.IEFixes.fixOpacity.apply(this)
			Programica.IEFixes.fixPng.apply(this)
			Programica.IEFixes.fixTitle.apply(this)
			Programica.IEFixes.fixLabel.apply(this)
			Programica.IEFixes.fixTitle.apply(this)
		}
		
		if (/MSIE 7/.test(navigator.userAgent))
		{
			this.onpropertychange = Programica.IEFixes.onpropertychange7
			
			Programica.IEFixes.fixOpacity.apply(this)
			Programica.IEFixes.fixTitle.apply(this)
		}
	},
	
	onpropertychange6: function ()
	{
		if (event.propertyName == 'style.opacity')
		{
			this.style.filter = "alpha(opacity=" + Math.round(this.style.opacity * 100) + ")"
			this.style.zoom = 1
		}
		else if (event.propertyName == 'disabled')
			Programica.IEFixes.fixDisabled.apply(this)
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
		if (this.currentStyle && this.currentStyle.opacity)
			this.style.opacity = this.currentStyle.opacity
	},
	
	fixDisabled: function ()
	{
		this.addClassName('disabled')
		this.disabled ? this.addClassName('disabled') : this.remClassName('disabled')
	},
	
	fixPng: function ()
	{
		if (this.runtimeStyle.filter) return
		if (this.tagName == 'IMG' && /\.png$/.test(this.src))
		{
			this.runtimeStyle.filter = "progid:DXImageTransform.Microsoft.AlphaImageLoader(src='" + this.src + "', sizingMethod='image')"
			this.setAttribute('src', '/lib/img/dot.gif')
		}
		else if (/url\("(.+\.a\.png)"\)$/.test(this.currentStyle.backgroundImage))
		{
			//alert(RegExp.$1)
			this.runtimeStyle.filter = "progid:DXImageTransform.Microsoft.AlphaImageLoader(src='" + RegExp.$1 + "', sizingMethod='crop')"
			this.runtimeStyle.backgroundImage = 'none'
			//this.width = this.width
			//this.setAttribute('src', '/lib/img/dot.gif')
		}
	},
	
	// убирает лишние подсказки
	fixTitle: function ()
	{
		if (!this.title) this.title = ''
	},
	
	// делает кликабельными метки
	fixLabel: function ()
	{
		if (this.tagName != 'LABEL') return
		var t = this
		this.attachEvent
		(
			'onclick',
			function ()
			{
				// трай/кеч нужен, как определить в ИЕ априори,
				// может ли элемент принять фокус сейчас
				try
				{
					var node = (t.getElementsByTagName('input')[0] || t.getElementsByTagName('textarea')[0] || t.getElementsByTagName('select')[0])
					if (node)
					{
						node.focus()
						node.click()
					}
				}
				catch (ex) {}
			}
		)
	},
	
	// добавляет методы и свойства из Element.prototype
	fixPrototype: function ()
	{
		if (!window.extend) return this
		if (window.Element) extend(this, Element.prototype)
		//if (this.tagName == 'FORM') alert(this['addEventListener'])
		if (this.tagName == 'FORM') extend(this, HTMLFormElement.prototype)
		
		return this
	}
}


Programica.IEFixes.eventConversion = { DOMMouseScroll: 'mousewheel' }

// кривоватый фикс addEventListener(...)
if (!window.addEventListener && window.attachEvent)
{
	Element.prototype.addEventListener = function (type, func, dir)
	{
		if (Programica.IEFixes.eventConversion[type])
			type = Programica.IEFixes.eventConversion[type]
		
		// JavaScript — сила! Какаво: сохранить функцию-обертку в свойстве оборачиваемой функции
		var t = this
		func.__IEwrapper = func.__IEwrapper || function (e)
		{
			e.target = e.srcElement
			e.preventDefault  = function () { var old = this.returnValue;  this.returnValue = false; return old }
			e.stopPropagation = function () { var old = this.cancelBubble; this.cancelBubble = true; return old }
			e.detail = - e.wheelDelta / 120
			func.apply(t, [e])
		}
		
		this.attachEvent('on' + type, func.__IEwrapper)
		
	}
	window.addEventListener = document.addEventListener = Element.prototype.addEventListener
}

// кривоватый фикс removeEventListener(...)
if (!window.removeEventListener && window.detachEvent)
{
	Element.prototype.removeEventListener = function (type, func, dir)
	{
		if (Programica.IEFixes.eventConversion[type])
			type = Programica.IEFixes.eventConversion[type]
		
		this.detachEvent('on' + type, func.__IEwrapper)
	}
	window.removeEventListener = document.removeEventListener = Element.prototype.removeEventListener
}

Programica.IEFixes.NS = {'http://www.programica.ru/2007/09/09':'pmc'}

// опять криво имитируем getAttributeNS(...)
if (!document.getAttributeNS)
	Element.prototype.getAttributeNS = function (ns, attr) { return this.getAttribute(Programica.IEFixes.NS[ns] + ':' + attr) }

document.realIECreateElement = document.createElement
document.createElement = function (type) { return Programica.IEFixes.fixPrototype.apply(document.realIECreateElement(type)) }

function $E  (type, props)
{
	if (props)
	{
		var html = []
		for (var i in props)
			html.push(i + '="' + encodeURI(props[i]) + '"')
		
		return document.createElement('<' + type + ' ' + html.join(' ') + '>')
	}
	
	return document.createElement(type)
}


document.write('<script id="__ie_onload" defer="defer" src="javascript:void(0)"></script>')
document.getElementById("__ie_onload").onreadystatechange = function ()
{
    if (this.readyState == "complete")
		window.oncontentready && window.oncontentready()
}


document.write('<style> * { behavior: expression(Programica.IEFixes.all.apply(this)) } </style>')

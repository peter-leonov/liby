
if (!self.Programica) Programica = {}
if (!self.HTMLFormElement) self.HTMLFormElement = {prototype:{}}
if (!self.Element) self.Element = {prototype:{}}

Programica.IEFixes =
{
	onpropertychange6: function ()
	{
		if (event.propertyName == 'style.opacity')
		{
			this.style.filter = "alpha(opacity=" + Math.round(this.style.opacity * 100) + ")"
			this.style.zoom = 1
		}
		else if (event.propertyName == 'disabled')
			Programica.IEFixes.fixDisabled(this)
		else if (event.propertyName == 'innerHTML')
			Programica.IEFixes.fixThem(this.all)
		/*else if (event.propertyName == 'className')
			Programica.IEFixes.fixOpacity(this)*/
	},
	
	onpropertychange7: function ()
	{
		if (event.propertyName == 'style.opacity')
		{
			this.style.filter = "alpha(opacity=" + Math.round(this.style.opacity * 100) + ")"
			this.style.zoom = 1
		}
		else if (event.propertyName == 'innerHTML')
			Programica.IEFixes.fixThem(this.all)
		/*else if (event.propertyName == 'className')
			Programica.IEFixes.fixOpacity(this)*/
	},
	
	//——————————————————————————————————————————————————————————————————————————
	
	fixOpacity: function (node)
	{
		if (node.currentStyle && node.currentStyle.opacity)
			node.style.opacity = node.currentStyle.opacity
	},
	
	fixDisabled: function (node)
	{
		node.addClassName('disabled')
		node.disabled ? node.addClassName('disabled') : node.remClassName('disabled')
	},
	
	fixPng: function (node)
	{
		if (node.runtimeStyle.filter) return
		if (node.tagName == 'IMG' && /\.png$/.test(node.src))
		{
			node.runtimeStyle.filter = "progid:DXImageTransform.Microsoft.AlphaImageLoader(src='" + node.src + "', sizingMethod='image')"
			node.setAttribute('src', '/lib/img/dot.gif')
		}
		else if (/url\("(.+\.a\.png)"\)$/.test(node.currentStyle.backgroundImage))
		{
			//alert(RegExp.$1)
			node.runtimeStyle.filter = "progid:DXImageTransform.Microsoft.AlphaImageLoader(src='" + RegExp.$1 + "', sizingMethod='crop')"
			node.runtimeStyle.backgroundImage = 'none'
			//node.width = node.width
			//node.setAttribute('src', '/lib/img/dot.gif')
		}
	},
	
	// убирает лишние подсказки
	fixTitle: function (node)
	{
		if (!node.title) node.title = ''
	},
	
	// делает кликабельными метки
	fixLabel: function (node)
	{
		if (node.tagName != 'LABEL') return
		
		node.attachEvent
		(
			'onclick',
			function ()
			{
				// трай/кеч нужен, иначе как надежно определить,
				// может ли элемент принять фокус сейчас или нет
				try
				{
					var n = (node.getElementsByTagName('input')[0] || node.getElementsByTagName('textarea')[0] || node.getElementsByTagName('select')[0])
					if (n)
					{
						n.click()
						n.focus()
					}
				}
				catch (ex) {}
			}
		)
	},
	
	// добавляет методы и свойства из Element.prototype
	fixPrototype: function (node)
	{
		var e = self.Element.prototype
		
		for (var p in e)
			node[p] = e[p]
		
		if (node.tagName == 'FORM')
		{
			e = HTMLFormElement.prototype
			for (var p in e)
				node[p] = e[p]
		}
	}
}


with (Programica.IEFixes)
{
	var fixIE6 = function (node)
	{
		node.runtimeStyle.behavior = 'none'
		
		fixPrototype(node)
		node.onpropertychange = onpropertychange6
		fixOpacity(node)
		fixPng(node)
		fixTitle(node)
		fixLabel(node)
		fixTitle(node)
	}
	
	var fixIE7 = function (node)
	{
		node.runtimeStyle.behavior = 'none'
		
		fixPrototype(node)
		node.onpropertychange = onpropertychange7
		fixOpacity(node)
		fixTitle(node)
	}
}

if (/MSIE 7/.test(navigator.userAgent))
	fixIE = fixIE7
else if (/MSIE 6/.test(navigator.userAgent))
	fixIE = fixIE6

Programica.IEFixes.fixThem = function (all)
{
	for (var i = 0, il = all.length; i < il; i++)
		fixIE(all[i])
}

Programica.IEFixes.eventConversion = { DOMMouseScroll: 'mousewheel' }

// кривоватый фикс addEventListener(...)
if (!self.addEventListener && self.attachEvent)
{
	Element.prototype.addEventListener = function (type, func, dir)
	{
		if (Programica.IEFixes.eventConversion[type])
			type = Programica.IEFixes.eventConversion[type]
		
		// JavaScript — сила! Каково: сохранить функцию-обертку в свойстве оборачиваемой функции
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
	self.addEventListener = document.addEventListener = Element.prototype.addEventListener
}

// кривоватый фикс removeEventListener(...)
if (!self.removeEventListener && self.detachEvent)
{
	Element.prototype.removeEventListener = function (type, func, dir)
	{
		if (Programica.IEFixes.eventConversion[type])
			type = Programica.IEFixes.eventConversion[type]
		
		this.detachEvent('on' + type, func.__IEwrapper)
	}
	self.removeEventListener = document.removeEventListener = Element.prototype.removeEventListener
}

Programica.IEFixes.NS = {'http://www.programica.ru/2007/09/09':'pmc'}

// опять криво имитируем getAttributeNS(...)
if (!document.getAttributeNS)
	Element.prototype.getAttributeNS = function (ns, attr) { return this.getAttribute(Programica.IEFixes.NS[ns] + ':' + attr) }

document.realIECreateElement = document.createElement
document.createElement = function (type)
{
	var e = document.realIECreateElement(type)
	Programica.IEFixes.fixPrototype(e)
	return e
}

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
	Programica.IEFixes.fixThem(document.all)
}

document.write('<style> * { behavior: expression(fixIE(this)) } </style>')


// for oldstyle popups
if (self.dialogArguments && self.dialogArguments.external)
	self.extern = self.dialogArguments.external
else if (self.external)
	self.extern = self.external

//var catcher = document.createElement('div')
//catcher.onpropertychange = function () { alert(event.propertyName + ' = ' + this[event.propertyName]) }
//$$$('head')[0].appendChild(node)
////node.x = undefined
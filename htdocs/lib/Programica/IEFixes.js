
if (!self.Programica) Programica = {}
if (!self.HTMLFormElement) self.HTMLFormElement = {prototype:{}}
if (!self.Element) self.Element = {prototype:{}}

with
(
	{
		P: Programica,
		e: self.Element.prototype,
		hfe: HTMLFormElement.prototype,
		rex1: /url\("(.+?)"\)$/
	}
)
{
	P.IEFixes =
	{
		opacity: function (node)
		{
			if ((s = node.style))
			{
				if (s.opacity < 1)
					s.filter = 'alpha(opacity=' + Math.round(s.opacity * 100) + ')'
				else
					s.filter = ''
				
				s.zoom = 1
			}
		},
		
		disabled: function (node)
		{
			node.addClassName('disabled')
			node.disabled ? node.addClassName('disabled') : node.remClassName('disabled')
		},
		
		// отчасти исправляет обработку png
		imgPng: function (node)
		{

			node.runtimeStyle.filter = "progid:DXImageTransform.Microsoft.AlphaImageLoader(src='" + node.src + "', sizingMethod='image')"
			node.setAttribute('src', '/lib/img/dot.gif')
			//node.runtimeStyle.visibility = 'hidden'
		},
		
		bgPng: function (node)
		{
			// rex1 is static, so I cut it out to the with(...)
			var m = rex1.exec(node.currentStyle.backgroundImage)
			node.runtimeStyle.filter = "progid:DXImageTransform.Microsoft.AlphaImageLoader(src='" + m[1] + "',sizingMethod='crop')"
			node.runtimeStyle.backgroundImage = 'none'
		},
		
		// делает кликабельными метки
		label: function (node)
		{
			node.attachEvent
			(
				'onclick',
				function ()
				{//alert(event.srcElement)
					// трай/кеч нужен; иначе необходимо определять,
					// может элемент принять фокус или не может
					try
					{
						n = (node.getElementsByTagName('input')[0] ||
								node.getElementsByTagName('textarea')[0] ||
								node.getElementsByTagName('select')[0])
						if (n)
							//n.fireEvent('on' + event.type, event)
							n.click(), n.focus()
					}
					catch (ex) { log(ex.message) }
				}
			)
		},
		
		// фиксим всплывание onchange до формы
		input: function (node)
		{
			node.attachEvent
			(
				node.type == 'text' ? 'onchange' : 'onclick',
				function () { try { node.form.onchange() } catch (ex) { log(ex.message) } }
			)
		},
		
		// добавляет методы и свойства из Element.prototype
		proto: function (node)
		{
			for (var p in e)
				node[p] = e[p]
		},
		
		// добавляет методы и свойства из HTMLFormElement.prototype
		formProto: function (node)
		{
			for (var p in hfe)
				node[p] = hfe[p]
		},
		
		fixThem: function (nodes)
		{
			for (var i = 0, il = nodes.length; i < il; i++)
				fixIE(nodes[i])
		}
	}
	
	with (P.IEFixes)
	{
		var onpropertychange6 = function ()
		{
			if (event.propertyName == 'style.opacity')
				opacity(this)
			else if (event.propertyName == 'disabled')
				disabled(this)
			else if (event.propertyName == 'innerHTML')
				fixThem(this.all)
		}
		
		var onpropertychange7 = function ()
		{
			if (event.propertyName == 'style.opacity')
				opacity(this)
			else if (event.propertyName == 'innerHTML')
				fixThem(this.all)
		}
		
		fixIE6 = function (node)
		{
			proto(node)
			node.onpropertychange = onpropertychange6
		}
		
		var fixIE7 = function (node)
		{
			proto(node)
			node.onpropertychange = onpropertychange7
		}
		
		if (/MSIE 7/.test(navigator.userAgent))
			fixIE = fixIE7
		else if (/MSIE 6/.test(navigator.userAgent))
			fixIE = fixIE6
		
		fixIEImgPng = imgPng
		fixIEBgPng = bgPng
	}
	
	
	
	P.IEFixes.eventConversion = { DOMMouseScroll: 'mousewheel' }
	
	P.IEFixes.preventDefault = function ()
	{
		var old = this.returnValue
		this.returnValue = false
		return old
	}
	
	P.IEFixes.stopPropagation = function ()
	{
		var old = this.cancelBubble
		this.cancelBubble = true
		return old
	}
	
	// yet another addEventListener(...) fix
	if (!self.addEventListener && self.attachEvent)
	{
		Element.prototype.addEventListener = function (type, func, dir)
		{
			if (type == 'change' && this.tagName == 'FORM')
			{
				if (!this.onchange)
					this.onchange = function ()
					{
						for (var i = 0; i < this.onchange.stack.length; i++)
							this.onchange.stack[i].apply(this, [window.event])
					}
				
				if (!this.onchange.stack)
					this.onchange.stack = []
				
				this.onchange.stack.push(func)
				return
			}
			
			type = P.IEFixes.eventConversion[type] || type
			
			var key = '__IEEventWrapper:'// + type + ':' + dir + ':' + this.uniqueID
			
			// JavaScript — сила!
			// Каково: сохранить функцию-обертку в свойстве оборачиваемой функции
			if (func[key])
			{
				this.detachEvent('on' + type, func[key])
			}
			else
			{
				var t = this
				func[key] = function (e)
				{
					e.target = e.srcElement
					e.preventDefault  = P.IEFixes.preventDefault
					e.stopPropagation = P.IEFixes.stopPropagation
					e.detail = - e.wheelDelta / 30
					func.apply(t, [e])
				}
			}
			
			this.attachEvent('on' + type, func[key])
		}
		
		self.addEventListener = document.addEventListener = Element.prototype.addEventListener
	}
	
	// quick fix for removeEventListener(...)
	if (!self.removeEventListener && self.detachEvent)
	{
		Element.prototype.removeEventListener = function (type, func, dir)
		{
			if (P.IEFixes.eventConversion[type])
				type = P.IEFixes.eventConversion[type]
			
			var key = '__IEEventWrapper:'// + type + ':' + dir + ':' + this.uniqueID
			if (func[key])
				this.detachEvent('on' + type, func[key])
		}
		
		self.removeEventListener = document.removeEventListener = Element.prototype.removeEventListener
	}
	
	// sorry mom, i had to fix this ****** onload call order bug
	{
		this['on-load-listeners'] = []
		
		self.addEventListenerReal = self.addEventListener
		self.addEventListener = function (type, func, dir)
		{
			if (type == 'load')
			{
				this.removeEventListener(type, func, dir)
				this['on-load-listeners'].push(func)
			}
			else
				this.addEventListenerReal(type, func, dir)
			
			return func
		}
		
		self.removeEventListenerReal = self.removeEventListener
		self.removeEventListener = function (type, func, dir)
		{
			if (type == 'load')
			{
				var newarr = []
				for (var i = 0; i < this['on-load-listeners'].length; i++)
					if (this['on-load-listeners'][i] != func)
						newarr.push(this['on-load-listeners'][i])
			}
			else
				this.removeEventListenerReal(type, func, dir)
			
			return func
		}
		
		// we have already done the wrapper job
		self.addEventListenerReal
		(
			'load',
			function (e)
			{
				for (var i = 0; i < this['on-load-listeners'].length; i++)
					this['on-load-listeners'][i](e)
			},
			true
		)
	}
	
	// another dirty fix: now for getAttributeNS(...)
	if (!document.getAttributeNS)
		Element.prototype.getAttributeNS = function (ns, attr) { return this.getAttribute(P.XMLNS[ns] + ':' + attr) }
	
	document.realIECreateElement = document.createElement
	document.createElement = function (type)
	{
		var e = document.realIECreateElement(type)
		P.IEFixes.proto(e)
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
	
	
	self.addEventListener('load', function () { P.IEFixes.fixThem(document.all) })
	
	P.IEFixes.CSSBindings =
	[
	'input{scrollbar-base-color:expression((runtimeStyle.scrollbarBaseColor="transparent"),Programica.IEFixes.input(this))}',
	'img{scrollbar-highlight-color:expression((runtimeStyle.scrollbarHighlightColor="transparent"),(title||(title="")))}',
	'form{scrollbar-face-color:expression((runtimeStyle.scrollbarFaceColor="transparent"),Programica.IEFixes.formProto(this))}'
	//'*{scrollbar-face-color:expression((runtimeStyle.scrollbarFaceColor="transparent"),fixIE(this))}'
	]
	
	if (/MSIE 6/.test(navigator.userAgent))
		P.IEFixes.CSSBindings.push('label{scrollbar-base-color:expression((runtimeStyle.scrollbarBaseColor="transparent"),Programica.IEFixes.label(this))}')
	
	document.write('<style>' + P.IEFixes.CSSBindings.join('\n') + '</style>')
	
	
	
	// for oldstyle popups
	if (self.dialogArguments && self.dialogArguments.external)
		self.extern = self.dialogArguments.external
	else if (self.external)
		self.extern = self.external
}
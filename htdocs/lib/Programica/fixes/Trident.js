;(function () {

if (!self.log)
	self.log = function () {}

if (!self.reportError)
	self.reportError = self.log


// appendChild, insertBefore, replaceChild

if (!self.HTMLFormElement) self.HTMLFormElement = {prototype:{}}
if (!self.Element) self.Element = {prototype:{}}

var realEvents = {onabort: 1, onactivate: 1, onafterprint: 1, onafterupdate: 1, onbeforeactivate: 1, onbeforecopy: 1, onbeforecut: 1, onbeforedeactivate: 1, onbeforeeditfocus: 1, onbeforepaste: 1, onbeforeprint: 1, onbeforeunload: 1, onbeforeupdate: 1, onblur: 1, onbounce: 1, one: 1, oncellchange: 1, onchange: 1, onclick: 1, oncontextmenu: 1, oncontrolselect: 1, oncopy: 1, oncut: 1, ondataavailable: 1, ondatasetchanged: 1, ondatasetcomplete: 1, ondblclick: 1, ondeactivate: 1, ondrag: 1, ondragend: 1, ondragenter: 1, ondragleave: 1, ondragover: 1, ondragstart: 1, ondrop: 1, onerror: 1, onerror: 1, onerrorupdate: 1, onfilterchange: 1, onfinish: 1, onfocus: 1, onfocusin: 1, onfocusout: 1, onhashchange: 1, onhelp: 1, onkeydown: 1, onkeypress: 1, onkeyup: 1, onlayoutcomplete: 1, onload: 1, onload: 1, onlosecapture: 1, onmessage: 1, onmousedown: 1, onmouseenter: 1, onmouseleave: 1, onmousemove: 1, onmouseout: 1, onmouseover: 1, onmouseup: 1, onmousewheel: 1, onmove: 1, onmoveend: 1, onmovestart: 1, onoffline: 1, ononline: 1, online: 1, onpaste: 1, onprogress: 1, onreadystatechange: 1, onreset: 1, onresize: 1, onresizeend: 1, onresizestart: 1, onrowenter: 1, onrowexit: 1, onrowsdelete: 1, onrowsinserted: 1, onscroll: 1, onselect: 1, onselectionchange: 1, onselectstart: 1, onstart: 1, onstop: 1, onstorage: 1, onstoragecommit: 1, onsubmit: 1, ontimeout: 1, onunload: 1}

function fixOpacity (node)
{
	if ((s = node.style))
	{
		if (s.opacity < 1)
			s.filter = 'alpha(opacity=' + Math.round(s.opacity * 100) + ')'
		else
			s.filter = ''
		
		s.zoom = 1
	}
}


function fixTarget (node)
{
	if (fixTarget.skip)
		return fixTarget.skip = false
	
	var target = node.target
	if (target)
	{
		var all = document.all
		for (var i = 0, il = all.length; i < il; i++)
			if (all[i].name === target)
			{
				fixTarget.skip = true
				node.target = all[i]['pmc::realIframeName']
			}
	}
}

function fixThem (nodes)
{
	var fix = fixIE
	for (var i = 0, il = nodes.length; i < il; i++)
		fix(nodes[i])
}

function fixDocumentAll ()
{
	fixThem(document.all)
}

function onpropertychange6 ()
{
	var e = event, node = e.srcElement
	if (e.propertyName == 'style.opacity')
		fixOpacity(node)
	else if (e.propertyName == 'innerHTML')
		fixThem(node.all)
	else if (e.propertyName == 'target')
		fixTarget(node)
	else if (realEvents[e.propertyName])
		wrapOnEvent(node, e.propertyName)
}

var onpropertychange7 = onpropertychange6

// function onpropertychange7 ()
// {
// 	var e = event, node = e.srcElement
// 	if (e.propertyName == 'style.opacity')
// 		fixOpacity(node)
// 	else if (e.propertyName == 'innerHTML')
// 		fixThem(node.all)
// 	else if (e.propertyName == 'target')
// 		fixTarget(node)
// 	else if (realEvents[e.propertyName])
// 		wrapOnEvent(node, e.propertyName)
// }

function fix_proto (node)
{
	var el = self.Element.prototype
	for (var p in el)
		node[p] = el[p]
	
	if (node.nodeName == 'INPUT' || node.nodeName == 'SELECT' || node.nodeName == 'TEXTAREA')
	{
		// input onchange bubbling on forms
		function onchange (e) { try { node.form.onchange(e) } catch (ex) { self.log&&self.log(ex.message) } }
		var ael = Element.prototype.addEventListener
		ael.call(node, 'change', onchange)
		ael.call(node, 'click',  onchange)
	}
	else if (node.nodeName == 'FORM')
	{
		var hfel = HTMLFormElement.prototype
		for (var p in hfel)
			node[p] = hfel[p]
	}
}


// function fix_appendChild (node) { this.appendChildReal(node) }

function fixIE6 (node)
{
	fix_proto(node)
	// node.onpropertychange = onpropertychange6
	node.attachEvent('onpropertychange', onpropertychange6)
	// node.appendChildReal = node.appendChild
	// node.appendChild = fix_appendChild
}

function fixIE7 (node)
{
	fix_proto(node)
	// node.onpropertychange = onpropertychange7
	node.attachEvent('onpropertychange', onpropertychange7)
}

function onBeforeUnload ()
{
	var stack = onBeforeUnload.stack
	for (var i = 0, il = stack.length; i < il; i++)
	{
		var el = stack[i]
		el[0].detachEvent(el[1], el[2])
	}
	onBeforeUnload.stack = []
}
onBeforeUnload.stack = []

if (/MSIE 7/.test(navigator.userAgent))
	fixIE = fixIE7
else if (/MSIE 6/.test(navigator.userAgent))
	fixIE = fixIE6

function wrapOnEvent (node, ontype)
{
	var type = ontype.replace(/^on/, '')
	if (node[ontype] && !node[ontype].isIEEventWrapper)
		node[ontype] = getEventWrapper(node, type, node[ontype], false)
}

function preventDefault ()
{
	var old = this.returnValue
	this.returnValue = false
	return old
}

function stopPropagation ()
{
	var old = this.cancelBubble
	this.cancelBubble = true
	return old
}

function getEventWrapper (node, type, func, dir)
{
	var pmc_uid = 'pmc::uniqueID'
	node[pmc_uid] = node[pmc_uid] || node.uniqueID
	var key = '__IEEventWrapper:' + type + ':' + dir + ':' + node[pmc_uid]
	
	if (func[key])
		return func[key]
	else
	{
		var wrapper = func[key] = function (e)
		{
			if (e === undefined)
				e = event
			e.target = e.srcElement
			e.preventDefault  = preventDefault
			e.stopPropagation = stopPropagation
			e.detail = - e.wheelDelta / 30
			e.pageX = e.clientX + document.documentElement.scrollLeft - document.body.clientLeft // document.body.scrollLeft
			e.pageY = e.clientY + document.documentElement.scrollTop  - document.body.clientTop // document.body.scrollTop
			func.call(node, e)
		}
		wrapper.isIEEventWrapper = true
		return wrapper
	}
}

function IEFixes ()
{
	IEFixes.eventConversion = { DOMMouseScroll: 'mousewheel', unload: 'beforeunload' }
	
	window.attachEvent('onbeforeunload', onBeforeUnload)
	
	// yet another addEventListener(...) fix
	if (!self.addEventListener && self.attachEvent)
		self.addEventListener = document.addEventListener = Element.prototype.addEventListener = function (type, func, dir)
		{
			dir = dir || false
			// window.status++
			type = IEFixes.eventConversion[type] || type
			
			var wrapper = getEventWrapper(this, type, func, dir)
			
			if (wrapper)
				this.detachEvent('on' + type, wrapper)
			
			if (type == 'change' && this.tagName == 'FORM')
			{
				if (!this.onchange)
					this.onchange = function (e)
					{
						for (var i = 0; i < this.onchange.stack.length; i++)
							this.onchange.stack[i].call(this, e || window.event)
					}
				
				if (!this.onchange.stack)
					this.onchange.stack = []
				
				this.onchange.stack.push(wrapper)
			}
			else
			{
				this.attachEvent('on' + type, wrapper)
				onBeforeUnload.stack.push([this, 'on' + type, wrapper])
			}
		}
	
	// quick fix for removeEventListener(...)
	if (!self.removeEventListener && self.detachEvent)
	{
		Element.prototype.removeEventListener = function (type, func, dir)
		{
			dir = dir || false
			if (IEFixes.eventConversion[type])
				type = IEFixes.eventConversion[type]
			
			var wrapper = getEventWrapper(this, type, func, dir)
			if (wrapper)
				this.detachEvent('on' + type, wrapper)
		}
		
		self.removeEventListener = document.removeEventListener = Element.prototype.removeEventListener
	}
	
	// sorry, i had to fix this onload call order bug
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
	
	var IFRAME_counter = 0
	document.nativeIECreateElement = document.createElement
	document.createElement = function (type)
	{
		var node
		if (type == 'iframe')
		{
			var realName = 'PMC_IFRAME_REAL_NAME_' + ++IFRAME_counter
			node = document.nativeIECreateElement('<IFRAME name="' + realName + '">')
			node['pmc::realIframeName'] = realName
		}
		else
			node = document.nativeIECreateElement(type)
		
		fixIE(node)
		return node
	}
	
	// self.$E = function (type, props)
	// {
	// 	if (props)
	// 	{
	// 		var html = []
	// 		for (var i in props)
	// 			html.push(i + '="' + encodeURI(props[i]) + '"')
	// 		
	// 		return document.createElement('<' + type + ' ' + html.join(' ') + '>')
	// 	}
	// 	
	// 	return document.createElement(type)
	// }
	
	if (!document.defaultView)
		document.defaultView = window
	
	if (!document.defaultView.getComputedStyle)
		document.defaultView.getComputedStyle = function (node) { return node.currentStyle }
	
	if (!document.createEvent)
	{
		function initEvent (type, bubbles, cancelable)
		{
			this.type = type
			this.bubbles = bubbles
			this.cancelable = cancelable
		}
		document.createEvent = function ()
		{
			var ne = document.createEventObject()
			ne.initEvent = initEvent
			return ne
		}
	}
	
	if (!document.dispatchEvent)
	{
		document.dispatchEvent = Element.prototype.dispatchEvent = function (e)
		{
			if (e.type == 'change')
				return this.onchange && this.onchange(e)
			else
				return this.fireEvent(e.type, e)
		}
	}
	
	self.addEventListener('load', fixDocumentAll)
	
	// for oldstyle popups
	if (self.dialogArguments && self.dialogArguments.external)
		self.extern = self.dialogArguments.external
	else if (self.external)
		self.extern = self.external
}

if (!IEFixes.applied)
{
	IEFixes()
	IEFixes.applied = true
}

})();
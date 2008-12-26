;(function () {

if (!self.log)
	self.log = function () {}

if (!self.reportError)
	self.reportError = self.log

var doc = document, undef

// this is necesary becouse IE can`t normaly use Array.prototype.slice() as defined in Progrmica/prototype.js
// so this is a fix for our Array.copy :)
Array.copy = function (s) { var d = []; if (s !== undef) for (var i = 0, len = s.length; i < len; i++) d[i] = s[i]; return d }

if (self.NodesShortcut)
	self.NodesShortcut.E = function (tag, cn, props)
	{
		if (props)
		{
			var html = []
			if (props.name)
			{
				html.push('name="' + props.name + '"')
				delete props.name
			}
			if (props.type)
			{
				html.push('type="' + props.type + '"')
				delete props.type
			}
			
			var node = doc.createElement('<' + tag + ' ' + html.join(' ') + '>')
			
			for (var i in props)
				node[i] = props[i]
			
			return node
		}
		else
			return doc.createElement(tag)
	}


// appendChild, insertBefore, replaceChild

if (!self.HTMLFormElement) self.HTMLFormElement = {prototype:{}}
if (!self.Element) self.Element = {prototype:{}}

// var realEvents = {onabort: 1, onactivate: 1, onafterprint: 1, onafterupdate: 1, onbeforeactivate: 1, onbeforecopy: 1, onbeforecut: 1, onbeforedeactivate: 1, onbeforeeditfocus: 1, onbeforepaste: 1, onbeforeprint: 1, onbeforeunload: 1, onbeforeupdate: 1, onblur: 1, onbounce: 1, one: 1, oncellchange: 1, onchange: 1, onclick: 1, oncontextmenu: 1, oncontrolselect: 1, oncopy: 1, oncut: 1, ondataavailable: 1, ondatasetchanged: 1, ondatasetcomplete: 1, ondblclick: 1, ondeactivate: 1, ondrag: 1, ondragend: 1, ondragenter: 1, ondragleave: 1, ondragover: 1, ondragstart: 1, ondrop: 1, onerror: 1, onerror: 1, onerrorupdate: 1, onfilterchange: 1, onfinish: 1, onfocus: 1, onfocusin: 1, onfocusout: 1, onhashchange: 1, onhelp: 1, onkeydown: 1, onkeypress: 1, onkeyup: 1, onlayoutcomplete: 1, onload: 1, onload: 1, onlosecapture: 1, onmessage: 1, onmousedown: 1, onmouseenter: 1, onmouseleave: 1, onmousemove: 1, onmouseout: 1, onmouseover: 1, onmouseup: 1, onmousewheel: 1, onmove: 1, onmoveend: 1, onmovestart: 1, onoffline: 1, ononline: 1, online: 1, onpaste: 1, onprogress: 1, onreadystatechange: 1, onreset: 1, onresize: 1, onresizeend: 1, onresizestart: 1, onrowenter: 1, onrowexit: 1, onrowsdelete: 1, onrowsinserted: 1, onscroll: 1, onselect: 1, onselectionchange: 1, onselectstart: 1, onstart: 1, onstop: 1, onstorage: 1, onstoragecommit: 1, onsubmit: 1, ontimeout: 1, onunload: 1}

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


// function fixTarget (node)
// {
// 	if (fixTarget.skip)
// 		return fixTarget.skip = false
// 	
// 	var target = node.target
// 	if (target)
// 	{
// 		var all = doc.all
// 		for (var i = 0, il = all.length; i < il; i++)
// 			if (all[i].name === target)
// 			{
// 				fixTarget.skip = true
// 				node.target = all[i]['pmc::realName']
// 			}
// 	}
// }

function fixThem (nodes)
{
	var fix = fixNode
	for (var i = 0, il = nodes.length; i < il; i++)
		fix(nodes[i])
}

function fixDocumentAll ()
{
	fixThem(doc.all)
}

function onpropertychange6 ()
{
	var e = event, node = e.srcElement, prop = e.propertyName
	if (prop == 'style.opacity')
		fixOpacity(node)
	else if (prop == 'innerHTML')
		fixThem(node.all)
	// else if (prop == 'target')
	// 	fixTarget(node)
	// else if (realEvents[prop])
	// 	wrapOnEvent(node, prop)
	else if (prop.indexOf('on') == 0)
		wrapOnEvent(node, prop)
}

var onpropertychange7 = onpropertychange6

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

function fixNode (node)
{
	fix_proto(node)
	// node.onpropertychange = onpropertychange6
	node.attachEvent('onpropertychange', onpropertychange6)
	// node.appendChildReal = node.appendChild
	// node.appendChild = fix_appendChild
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
			if (e === undef)
				e = event
			e.target = e.srcElement
			e.preventDefault  = preventDefault
			e.stopPropagation = stopPropagation
			e.detail = - e.wheelDelta / 30
			e.pageX = e.clientX + doc.documentElement.scrollLeft - doc.body.clientLeft // doc.body.scrollLeft
			e.pageY = e.clientY + doc.documentElement.scrollTop  - doc.body.clientTop // doc.body.scrollTop
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
		self.addEventListener = doc.addEventListener = Element.prototype.addEventListener = function (type, func, dir)
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
		
		self.removeEventListener = doc.removeEventListener = Element.prototype.removeEventListener
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
	
	var NAME_counter = 0
	doc.nativeCreateElement = doc.createElement
	doc.createElement = function (type)
	{
		var node
		// if (type == 'input' || type == 'iframe')
		// {
		// 	var realName = 'PMC_REAL_NAME_' + ++NAME_counter
		// 	node = doc.nativeCreateElement('<' + type + ' name="' + realName + '">')
		// 	node['pmc::realName'] = realName
		// }
		// else
			node = doc.nativeCreateElement(type)
		
		fixNode(node)
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
	// 		return doc.createElement('<' + type + ' ' + html.join(' ') + '>')
	// 	}
	// 	
	// 	return doc.createElement(type)
	// }
	
	if (!doc.defaultView)
		doc.defaultView = window
	
	if (!doc.defaultView.getComputedStyle)
		doc.defaultView.getComputedStyle = function (node) { return node.currentStyle }
	
	if (!doc.createEvent)
	{
		function initEvent (type, bubbles, cancelable)
		{
			this.type = type
			this.bubbles = bubbles
			this.cancelable = cancelable
		}
		doc.createEvent = function ()
		{
			var ne = doc.createEventObject()
			ne.initEvent = initEvent
			return ne
		}
	}
	
	if (!doc.dispatchEvent)
	{
		doc.dispatchEvent = Element.prototype.dispatchEvent = function (e)
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

<!--# include file="Trident.XHR.js" -->
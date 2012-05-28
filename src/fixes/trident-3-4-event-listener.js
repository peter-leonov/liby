(function(){

var doc = document, docelem = doc.documentElement, win = window, undef
win.__pmc_isWindow = true

if (win.addEventListener || !win.attachEvent)
	return

var eventTransport = doc.__pmc__eventTransport = 'beforeeditfocus'

function elementSupportedEvents () {}
var supportedEvents = elementSupportedEvents.prototype = {abort:1, activate:1, afterprint:1, afterupdate:1, beforeactivate:1, beforecopy:1, beforecut:1, beforedeactivate:1, beforeeditfocus:1, beforepaste:1, beforeprint:1, beforeunload:1, beforeupdate:1, blur:1, bounce:1, cellchange:1, change:1, click:1, contextmenu:1, controlselect:1, copy:1, cut:1, dataavailable:1, datasetchanged:1, datasetcomplete:1, dblclick:1, deactivate:1, drag:1, dragend:1, dragenter:1, dragleave:1, dragover:1, dragstart:1, drop:1, error:1, errorupdate:1, filterchange:1, finish:1, focus:1, focusin:1, focusout:1, help:1, keydown:1, keypress:1, keyup:1, layoutcomplete:1, load:2, losecapture:1, message:1, mousedown:1, mouseenter:1, mouseleave:1, mousemove:1, mouseout:1, mouseover:1, mouseup:1, mousewheel:1, move:1, moveend:1, movestart:1, offline:1, online:1, page:1, paste:1, progress:1, propertychange:1, readystatechange:1, reset:1, resize:1, resizeend:1, resizestart:1, rowenter:1, rowexit:1, rowsdelete:1, rowsinserted:1, scroll:1, select:1, selectionchange:1, selectstart:1, start:1, stop:1, storage:1, storagecommit:1, submit:2, timeout:1, unload:1}

// may be set supportedEvents.hashchange = 1 in IE 8

var captureOnlyEvents = {focus: 1, blur: 1}

function scriptSupportedEvents () {}
scriptSupportedEvents.prototype = new elementSupportedEvents()
scriptSupportedEvents.prototype.load = false

var supportedEventsByNodeName =
{
	'SCRIPT': scriptSupportedEvents.prototype
}

function isEventSupportedOnNode (node, type)
{
	return (supportedEventsByNodeName[node.nodeName] || supportedEvents)[type]
}

var Event = win.Event = function () { this.constructor = Event }

Event.CAPTURING_PHASE = 1
Event.AT_TARGET = 2
Event.BUBBLING_PHASE = 3

Event.prototype =
{
	__updateFromNative: function (e)
	{
		var type = e.type
		 
		this.initEvent(type, !captureOnlyEvents[type], true)
		
		this.clientX = e.clientX
		this.clientY = e.clientY
		this.button = e.button
		this.charCode = e.charCode
		this.keyCode = e.keyCode
		this.currentTarget = this.target = (e.srcElement || doc) // dirty hack for window/document targets
		this.detail = - e.wheelDelta / 30
		this.pageX = e.clientX + docelem.scrollLeft - doc.body.clientLeft // document.body.scrollLeft
		this.pageY = e.clientY + docelem.scrollTop  - doc.body.clientTop // document.body.scrollTop
		this.dataTransfer = e.dataTransfer
	},
	
	initEvent: function (type, bubbles, cancelable)
	{
		this.type = type
		this.bubbles = bubbles
		this.cancelable = cancelable
		this.timeStamp = +new Date()
	},
	
	preventDefault: function ()
	{
		this.__pmc__event.returnValue = false
		this.defaultPrevented = true
	},
	
	stopPropagation: function ()
	{
		this.__propagationStopped = true
		this.__pmc__event.cancelBubble = true
	}
}

// var DocumentEvent = win.DocumentEvent = function () { this.constructor = DocumentEvent }
// DocumentEvent.prototype = new Event()
var UIEvent = win.UIEvent = function () { this.constructor = UIEvent }
UIEvent.prototype = new Event()
UIEvent.prototype.initUIEvent = function (type, bubbles, cancelable, view, detail)
{
	this.type = type
	this.bubbles = bubbles
	this.cancelable = cancelable
	this.timeStamp = +new Date()
	
	this.view = view
	this.detail = detail
}

var MouseEvent = win.MouseEvent = function () { this.constructor = MouseEvent }
MouseEvent.prototype = new Event()
MouseEvent.prototype.initMouseEvent = function (type, bubbles, cancelable, view, detail, sx, sy, cx, cy, ctrl, alt, shift, meta, button, rTarget)
{
	this.type = type
	this.bubbles = bubbles
	this.cancelable = cancelable
	this.timeStamp = +new Date()
	
	this.view = view
	this.detail = detail
	this.screenX = sx
	this.screenY = sy
	this.clientX = cx
	this.clientY = cy
	
	this.ctrlKey = ctrl
	this.altKey = alt
	this.shiftKey = shift
	this.metaKey = meta
	
	this.button = button
	this.relatedTarget = rTarget
}
var KeyboardEvent = win.KeyboardEvent = function () { this.constructor = KeyboardEvent }
KeyboardEvent.prototype = new Event()
var MutationEvent = win.MutationEvent = function () { this.constructor = MutationEvent }
MutationEvent.prototype = new Event()

var eventConstructors = {Event:Event, /*DocumentEvent:DocumentEvent,*/ UIEvent:UIEvent, MouseEvent:MouseEvent, KeyboardEvent:KeyboardEvent, MutationEvent:MutationEvent}


function getEventWrapper (e, kind)
{
	if (e.__pmc__wrapper)
		return e.__pmc__wrapper
	var w = new (eventConstructors[kind] || Event)()
	w.__updateFromNative(e)
	w.__pmc__event = e
	e.__pmc__wrapper = w
	
	return w
}

doc.__pmc__eventListeners = {}
win.__pmc__eventListeners = {}

win.__pmc_dispatchEvent = doc.__pmc_dispatchEvent = Element.prototype.__pmc_dispatchEvent = function (w)
{
	var target = w.target,
		node = this,
		type = w.type
	
	var branch = [], branchListeners = [], head, headListeners, // captures = [], bubbles = [],
		all, byType, listeners
	
	if (target.__pmc_isWindow)
	{
		branch.push(win)
		all = win.__pmc__eventListeners
		branchListeners.push(all && all[type])
	}
	else if (target === doc)
	{
		branch.push(doc)
		all = doc.__pmc__eventListeners
		branchListeners.push(all && all[type])
		
		branch.push(win)
		all = win.__pmc__eventListeners
		branchListeners.push(all && all[type])
	}
	else
	{
		for (; node; node = node.parentNode)
		{
			branch.push(node)
			all = node.__pmc__eventListeners
			branchListeners.push(all && all[type])
		}
		
		branch.push(win)
		all = win.__pmc__eventListeners
		branchListeners.push(all && all[type])
	}
	
	if (this === target)
	{
		head = target
		headListeners = branchListeners[0]
		branchListeners[0] = null
	}
	
	
	w.defaultPrevented = false
	w.__propagationStopped = false
	
	
	w.eventPhase = 1
	
	for (var i = branchListeners.length - 1; i >= 0; i--)
	{
		var listeners = branchListeners[i]
		if (!listeners)
			continue
		
		listeners = listeners[1]
		if (!listeners)
			continue
		
		for (var j = 0, jl = listeners.length; j < jl; j++)
		{
			// try
			// {
				listeners[j].call(branch[i], w)
			// }
			// catch (ex)
			// {
			// 	// this trick is useful to report errors from all listeners
			// 	// 1000 delay helps to avoid sensitive lag when error reporting is on
			// 	window.setTimeout(function () { throw ex }, 1000)
			// }
		}
		
		if (w.__propagationStopped)
			return
	}
	
	if (head)
	{
		w.eventPhase = 2
		
		capture:
		{
			if (!headListeners)
				break capture
		
			listeners = headListeners[1]
			if (!listeners)
				break capture
		
			for (var j = 0, jl = listeners.length; j < jl; j++)
			{
				// try
				// {
					listeners[j].call(head, w)
				// }
				// catch (ex)
				// {
				// 	// this trick is useful to report errors from all listeners
				// 	// 1000 delay helps to avoid sensitive lag when error reporting is on
				// 	window.setTimeout(function () { throw ex }, 1000)
				// }
			}
		}
	
		bubble:
		{
			if (!headListeners)
				break bubble
		
			listeners = headListeners[0]
			if (!listeners)
				break bubble
		
			for (var j = 0, jl = listeners.length; j < jl; j++)
			{
				// try
				// {
					listeners[j].call(head, w)
				// }
				// catch (ex)
				// {
				// 	// this trick is useful to report errors from all listeners
				// 	// 1000 delay helps to avoid sensitive lag when error reporting is on
				// 	window.setTimeout(function () { throw ex }, 1000)
				// }
			}
		}
	}
	
	if (!w.bubbles)
		return
	
	if (w.__propagationStopped)
		return
	
	
	w.eventPhase = 3
	
	for (var i = 0, il = branchListeners.length; i < il; i++)
	{
		var listeners = branchListeners[i]
		if (!listeners)
			continue
		
		listeners = listeners[0]
		if (!listeners)
			continue
		
		for (var j = 0, jl = listeners.length; j < jl; j++)
		{
			// try
			// {
				listeners[j].call(branch[i], w)
			// }
			// catch (ex)
			// {
			// 	// this trick is useful to report errors from all listeners
			// 	// 1000 delay helps to avoid sensitive lag when error reporting is on
			// 	window.setTimeout(function () { throw ex }, 1000)
			// }
		}
		
		if (w.__propagationStopped)
			return
	}
}

win.__pmc_getListeners = doc.__pmc_getListeners = Element.prototype.__pmc_getListeners = function (type, dir)
{
	var all = this.__pmc__eventListeners
	if (!all)
		all = this.__pmc__eventListeners = {}
	
	var byType = all[type]
	if (!byType)
	{
		byType = all[type] = []
		byType.catcher = this.__pmc__bindCatcher(type)
	}
	
	var listeners = byType[dir]
	if (!listeners)
		listeners = byType[dir] = []
	
	return listeners
}

win.__pmc__bindCatcher = doc.__pmc__bindCatcher = Element.prototype.__pmc__bindCatcher = function (type)
{
	var c = this.__pmc__catcher
	if (!c)
	{
		var node = this
		function catcher ()
		{
			if (event.__pmc_dispatched)
				return
			event.__pmc_dispatched = true
			
			var w = getEventWrapper(event)
			
			node.__pmc_dispatchEvent(w)
		}
		
		c = this.__pmc__catcher = catcher
	}
	
	var key = '__pmc_catcher_bind:' + type
	if (!c[key])
	{
		this.attachEvent('on' + type, c)
		c[key] = true
	}
	return catcher
}

win.__pmc_addEventListener = doc.__pmc_addEventListener = Element.prototype.__pmc_addEventListener = function (type, func, dir)
{
	var listeners = this.__pmc_getListeners(type, dir)
	
	var dup = listeners.indexOf(func)
	if (dup != -1)
		listeners.splice(dup, 1)
	
	listeners.push(func)
}

win.__pmc_removeEventListener = doc.__pmc_removeEventListener = Element.prototype.__pmc_removeEventListener = function (type, func, dir)
{
	var all = this.__pmc__eventListeners
	if (!all)
		return
	
	var byType = all[type]
	if (!byType)
		return
	
	var listeners = byType[dir]
	if (!listeners)
		return
	
	var dup = listeners.indexOf(func)
	if (dup != -1)
	{
		listeners.splice(dup, 1)
		// if (--byType.total == 0)
		// {
		// 	this.detachEvent('on' + type, byType.catcher)
		// }
	}
}


doc.addEventListener = Element.prototype.addEventListener = function (type, func, dir)
{
	this.__pmc_addEventListener(type, func, dir ? 1 : 0)
}

win.addEventListener = function (type, func, dir)
{
	// returned catcher is useless ATM
	document.__pmc__bindCatcher(type)
	this.__pmc_addEventListener(type, func, dir ? 1 : 0)
}

win.removeEventListener = doc.removeEventListener = Element.prototype.removeEventListener = function (type, func, dir)
{
	this.__pmc_removeEventListener(type, func, dir ? 1 : 0)
}


doc.createEvent = function (kind)
{
	return getEventWrapper(doc.createEventObject(), kind)
}

doc.dispatchEvent = Element.prototype.dispatchEvent = function (w)
{
	var type = w.type
	
	w.target = this
	
	if (isEventSupportedOnNode(this, type))
		this.fireEvent('on' + type, w.__pmc__event)
	else
		this.__pmc_dispatchEvent(w)
	
	return !w.defaultPrevented
}

// MSIE doesn't support fireEvent() on window,
// so do the direct dispatch
win.dispatchEvent = function (w)
{
	w.target = this
	this.__pmc_dispatchEvent(w)
	return !w.defaultPrevented
}

})();
(function(){

var doc = document, docelem = doc.documentElement, win = window, undef

if (win.addEventListener || !win.attachEvent)
	return

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
window.attachEvent('onbeforeunload', onBeforeUnload)

var eventTransport = doc.__pmc__eventTransport = 'beforeeditfocus',
	supportedEvents = {abort:1, activate:1, afterprint:1, afterupdate:1, beforeactivate:1, beforecopy:1, beforecut:1, beforedeactivate:1, beforeeditfocus:1, beforepaste:1, beforeprint:1, beforeunload:1, beforeupdate:1, blur:1, bounce:1, cellchange:1, change:1, click:1, contextmenu:1, controlselect:1, copy:1, cut:1, dataavailable:1, datasetchanged:1, datasetcomplete:1, dblclick:1, deactivate:1, drag:1, dragend:1, dragenter:1, dragleave:1, dragover:1, dragstart:1, drop:1, error:1, errorupdate:1, filterchange:1, finish:1, focus:1, focusin:1, focusout:1, hashchange:1, help:1, keydown:1, keypress:1, keyup:1, layoutcomplete:1, load:1, losecapture:1, message:1, mousedown:1, mouseenter:1, mouseleave:1, mousemove:1, mouseout:1, mouseover:1, mouseup:1, mousewheel:1, move:1, moveend:1, movestart:1, offline:1, online:1, page:1, paste:1, progress:1, propertychange:1, readystatechange:1, reset:1, resize:1, resizeend:1, resizestart:1, rowenter:1, rowexit:1, rowsdelete:1, rowsinserted:1, scroll:1, select:1, selectionchange:1, selectstart:1, start:1, stop:1, storage:1, storagecommit:1, submit:1, timeout:1, unload:1}

var Event = win.Event = function () { this.constructor = Event }

Event.prototype =
{
	__updateFromNative: function (e)
	{
		this.type = e.type
		this.clientX = e.clientX
		this.clientY = e.clientY
		this.charCode = e.charCode
		this.keyCode = e.keyCode
		this.currentTarget = this.target = e.srcElement
		this.detail = - e.wheelDelta / 30
		this.pageX = e.clientX + docelem.scrollLeft - document.body.clientLeft // document.body.scrollLeft
		this.pageY = e.clientY + docelem.scrollTop  - document.body.clientTop // document.body.scrollTop
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
		if (this.__isDispatching)
		{
			this.__pmc__event.returnValue = false
			this.defaultPrevented = true
		}
	},
	
	stopPropagation: function ()
	{
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

win.addEventListener = doc.addEventListener = Element.prototype.addEventListener = function (type, func, dir)
{
	if (dir === undef)
		dir = false
	
	var all = this.__pmc__eventListeners
	if (!all)
		all = this.__pmc__eventListeners = {}
	
	var key = type + ':' + dir
	
	var listeners = all[key]
	if (!listeners)
	{
		listeners = all[key] = []
		
		var me = this
		function dispatcher ()
		{
			var w = getEventWrapper(event)
			// check if we got a custom event that does not match our type
			if (type !== w.type)
				return
			
			w.__isDispatching = true
			for (var i = 0, il = listeners.length; i < il; i++)
			{
				try
				{
					listeners[i].call(me, w)
				}
				catch (ex)
				{
					// this trick is useful to report errors from all listeners
					// 1000 delay helps to avoid sensitive lag when error reporting is on
					setTimeout(function () { throw ex }, 1000)
				}
			}
			delete w.__isDispatching
		}
		
		var transport = type in supportedEvents ? type : eventTransport
		this.attachEvent('on' + transport, dispatcher)
		listeners.dispatcher = dispatcher
	}
	
	var dup = listeners.indexOf(func)
	if (dup != -1)
		listeners.splice(dup, 1)
	
	listeners.push(func)
}

win.removeEventListener = doc.removeEventListener = Element.prototype.removeEventListener = function (type, func, dir)
{
	if (dir === undef)
		dir = false
	
	var all = this.__pmc__eventListeners
	if (!all)
		return
	
	var key = type + ':' + dir
	
	var listeners = all[key]
	if (!listeners)
		return
	
	var dup = listeners.indexOf(func)
	if (dup != -1)
		listeners.splice(dup, 1)
	
	if (!listeners.length)
	{
		delete all[key]
		var transport = type in supportedEvents ? type : eventTransport
		this.detachEvent('on' + transport, listeners.dispatcher)
	}
}

doc.createEvent = function (kind)
{
	return getEventWrapper(doc.createEventObject(), kind)
}

doc.dispatchEvent = Element.prototype.dispatchEvent = function (w)
{
	var type = w.type
	if (!(type in supportedEvents))
		type = eventTransport
	
	w.__isDispatching = true
	w.defaultPrevented = false
	w.target = this
	this.fireEvent('on' + type, w.__pmc__event)
	delete w.__isDispatching
	return !w.defaultPrevented
}

})();
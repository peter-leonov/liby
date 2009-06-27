(function(){

var doc = document, docelem = doc.documentElement, body = doc.body, win = window, undef

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

var Event = win.Event = function (event)
{
	this.constructor = Event
}

Event.prototype =
{
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
	},
	
	stopPropagation: function ()
	{
		this.__pmc__event.cancelBubble = true
	}
}


window.uniqueID = document.uniqueID
// uniqueID is not a constant for document
document.__uniqueID = document.uniqueID

function getEventWrapper (e)
{
	if (e.__pmc__wrapper)
		return e.__pmc__wrapper
	var w = new Event()
	
	w.type = e.type
	w.currentTarget = w.target = e.srcElement
	w.detail = - e.wheelDelta / 30
	w.pageX = e.clientX + docelem.scrollLeft - body.clientLeft // body.scrollLeft
	w.pageY = e.clientY + docelem.scrollTop  - body.clientTop // body.scrollTop
	
	w.__pmc__event = e
	e.__pmc__wrapper = w
	
	return w
}

function getEventListenerWrapper (node, type, func, dir)
{
	var key = '__IEEventWrapper:' + type + ':' + dir + ':' + (node.__uniqueID || node.uniqueID)
	
	if (func[key])
		return func[key]
	else
	{
		var wrapper = func[key] = function (e)
		{
			if (e === undef)
				e = event
			
			var w = getEventWrapper(e)
			if (type !== w.type)
				return
			func.call(node, w)
		}
		wrapper.__pmc__eventListenerWrapper = key
		return wrapper
	}
}

win.addEventListener = doc.addEventListener = Element.prototype.addEventListener = function (type, func, dir)
{
	if (dir === undef)
		dir = false
	
	var wrapper = getEventListenerWrapper(this, type, func, dir)
	if (wrapper)
		this.detachEvent('on' + type, wrapper)
	
	if (!(type in supportedEvents))
	{
		type = eventTransport
		// alert(type)
	}
	this.attachEvent('on' + type, wrapper)
	onBeforeUnload.stack.push([this, 'on' + type, wrapper])
}

win.removeEventListener = doc.removeEventListener = Element.prototype.removeEventListener = function (type, func, dir)
{
	if (dir === undef)
		dir = false
	
	var wrapper = getEventListenerWrapper(this, type, func, dir)
	if (!(type in supportedEvents))
		type = eventTransport
	if (wrapper)
		this.detachEvent('on' + type, wrapper)
}

doc.createEvent = function (kind)
{
	return getEventWrapper(doc.createEventObject())
}

doc.dispatchEvent = Element.prototype.dispatchEvent = function (w)
{
	var type = w.type
	if (!(type in supportedEvents))
	{
		type = eventTransport
		// alert('dispatchEvent: ' + type)
	}
	
	return this.fireEvent('on' + type, w.__pmc__event)
}

})();
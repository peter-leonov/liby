(function(){

var doc = document, win = window, undef

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

var eventConversion = { DOMMouseScroll: 'mousewheel', unload: 'beforeunload' },
	eventTransport = doc.__pmc__eventTransport = 'beforeeditfocus',
	supportedEvents = {abort:1, activate:1, afterprint:1, afterupdate:1, beforeactivate:1, beforecopy:1, beforecut:1, beforedeactivate:1, beforeeditfocus:1, beforepaste:1, beforeprint:1, beforeunload:1, beforeupdate:1, blur:1, bounce:1, cellchange:1, change:1, click:1, contextmenu:1, controlselect:1, copy:1, cut:1, dataavailable:1, datasetchanged:1, datasetcomplete:1, dblclick:1, deactivate:1, drag:1, dragend:1, dragenter:1, dragleave:1, dragover:1, dragstart:1, drop:1, error:1, errorupdate:1, filterchange:1, finish:1, focus:1, focusin:1, focusout:1, hashchange:1, help:1, keydown:1, keypress:1, keyup:1, layoutcomplete:1, load:1, losecapture:1, message:1, mousedown:1, mouseenter:1, mouseleave:1, mousemove:1, mouseout:1, mouseover:1, mouseup:1, mousewheel:1, move:1, moveend:1, movestart:1, offline:1, online:1, page:1, paste:1, progress:1, propertychange:1, readystatechange:1, reset:1, resize:1, resizeend:1, resizestart:1, rowenter:1, rowexit:1, rowsdelete:1, rowsinserted:1, scroll:1, select:1, selectionchange:1, selectstart:1, start:1, stop:1, storage:1, storagecommit:1, submit:1, timeout:1, unload:1}

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

window.uniqueID = document.uniqueID
// uniqueID is not a constant for document
document.__uniqueID = document.uniqueID


function getEventWrapper (node, type, func, dir)
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
			e.currentTarget = e.target = e.srcElement
			e.preventDefault = preventDefault
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

win.addEventListener = doc.addEventListener = Element.prototype.addEventListener = function (type, func, dir)
{
	if (dir === undef)
		dir = false
	if (type in eventConversion)
		type = eventConversion[type]
	
	var wrapper = getEventWrapper(this, type, func, dir)
	if (wrapper)
		this.detachEvent('on' + type, wrapper)
	
	if (!(type in supportedEvents))
	{
		// type = 
		// alert(type)
	}
	this.attachEvent('on' + type, wrapper)
	onBeforeUnload.stack.push([this, 'on' + type, wrapper])
}

win.removeEventListener = doc.removeEventListener = Element.prototype.removeEventListener = function (type, func, dir)
{
	if (dir === undef)
		dir = false
	if (type in eventConversion)
		type = eventConversion[type]
	
	var wrapper = getEventWrapper(this, type, func, dir)
	if (wrapper)
		this.detachEvent('on' + type, wrapper)
}


function initEvent (type, bubbles, cancelable)
{
	this.type = type
	this.bubbles = bubbles
	this.cancelable = cancelable
}

doc.createEvent = function (kind)
{
	var e = doc.createEventObject()
	e.initEvent = initEvent
	e.timeStamp = +new Date()
	return e
}

doc.dispatchEvent = Element.prototype.dispatchEvent = function (e)
{
	return this.fireEvent(e.type, e)
}





// fix for onload call order bug
{
	var onLoadListeners = win.__iefixes_onLoadListeners = []
	
	win.addEventListenerReal = win.addEventListener
	win.addEventListener = function (type, func, dir)
	{
		if (type == 'load')
		{
			this.removeEventListener(type, func, dir)
			onLoadListeners.push(func)
		}
		else
			this.addEventListenerReal(type, func, dir)
		
		return func
	}
	
	win.removeEventListenerReal = win.removeEventListener
	win.removeEventListener = function (type, func, dir)
	{
		if (type == 'load')
		{
			for (var i = 0; i < onLoadListeners.length; i++)
			{
				if (onLoadListeners[i] === func)
					onLoadListeners[i] = null
			}
		}
		else
			this.removeEventListenerReal(type, func, dir)
		
		return func
	}
	
	// we have already done the wrapper job
	win.addEventListenerReal
	(
		'load',
		function (e)
		{
			for (var i = 0; i < onLoadListeners.length; i++)
			{
				var listener = onLoadListeners[i]
				if (listener)
					listener.call(this, e)
			}
		},
		true
	)
}


})();
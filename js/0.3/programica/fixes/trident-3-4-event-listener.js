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

var eventConversion = { DOMMouseScroll: 'mousewheel', unload: 'beforeunload' }

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
doc.createEvent = function ()
{
	var ne = doc.createEventObject()
	ne.initEvent = initEvent
	return ne
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
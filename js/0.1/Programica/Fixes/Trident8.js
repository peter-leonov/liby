;(function(){

var doc = document, win = window, undef

// Object.defineProperty(CSSStyleDeclaration.prototype, 'opacity', {set: function (v) { (this.filter = 'alpha(opacity=' + Math.round((this.__pmc_opacity = (v < 0 ? 0 : (v > 1 ? 1 : v))) * 100) + ')') }, get: function () { return this.__pmc_opacity }})

if (!win.log)
	win.log = function () {}

if (!win.reportError)
	win.reportError = win.log

Array.copy = function (src) { var dst = []; for (var i = 0, len = src.length; i < len; i++) dst[i] = src[i]; return dst }

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


var eventConversion = {DOMMouseScroll: 'mousewheel', unload: 'beforeunload', keypress: 'keydown'}

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


// yet another addEventListener(...) fix
if (!win.addEventListener && win.attachEvent)
	win.addEventListener = doc.addEventListener = Element.prototype.addEventListener = function (type, func, dir)
	{
		dir = dir || false
		// window.status++
		type = eventConversion[type] || type
		
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
if (!win.removeEventListener && win.detachEvent)
	win.removeEventListener = doc.removeEventListener = Element.prototype.removeEventListener = function (type, func, dir)
	{
		dir = dir || false
		if (eventConversion[type])
			type = eventConversion[type]
		
		var wrapper = getEventWrapper(this, type, func, dir)
		if (wrapper)
			this.detachEvent('on' + type, wrapper)
	}

// based on jQuery onready for IE
// based on the trick by Diego Perini (http://javascript.nwbox.com/IEContentLoaded/)
function checkready ()
{
	try { document.documentElement.doScroll("left") }
	catch (ex) { return }
	
	// IE8 gain native support for Element.prototype
	// so IEFixes_fixThemAll is no more needed
	clearInterval(checkready.interval)
	try { $.onready.run() } catch (ex) {}
}
checkready.interval = setInterval(checkready, 100)

})();
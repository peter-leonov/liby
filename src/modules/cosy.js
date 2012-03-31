$.onload = function (fn) { return self.addEventListener('load', fn, false) }
$.onready = function (f) { document.addEventListener('DOMContentLoaded', f, false) }
$.load = function (src)
{
	var me = arguments.callee
	var cache = me.cache || (me.cache = {}) 
	if (me.cache[src])
		return me.cache[src]
	var node = document.createElement('script')
	node.type = 'text/javascript'
	node.src = src
	document.getElementsByTagName('head')[0].appendChild(node)
	cache[src] = node
	return node
}
$.iamready = function ()
{
	var e = document.createEvent('Event')
	e.initEvent('ready', false, false)
	document.dispatchEvent(e)
}
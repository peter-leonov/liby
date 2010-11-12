function $ (id) { return document.getElementById(id) }

$.onload = function (fn) { return self.addEventListener('load', fn, false) }
$.include = function (src)
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

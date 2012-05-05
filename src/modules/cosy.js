;(function(){

function list2array (list)
{
	var arr = []
	for (var i = 0, il = list.length; i < il; i++)
		arr[i] = list[i]
	return arr
}

window.$$ = function (query, root)
{
	var list = (root || document).querySelectorAll(query)
	// if (!list || list.length == 0)
	// 	alert('empty $$("' + query + '")')
	return list2array(list)
}
window.$ = function (id) { return document.getElementById(id) }

$.onload = function (f) { return window.addEventListener('load', f, false) }
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

})();

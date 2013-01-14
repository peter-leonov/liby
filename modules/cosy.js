;(function(){

window.$$ = function (query, root)
{
	var list = (root || document).querySelectorAll(query)
	if (list.length == 0)
	{
		log('empty $$("' + query + '")')
		return []
	}
	
	return Array.from(list)
}
window.$ = function (query, root)
{
	var node = (root || document).querySelector(query)
	if (!node)
	{
		log('empty $("' + query + '")')
		return node
	}
	
	return node
}

$.id = function (id) { return document.getElementById(id) }

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

$.require = function (src)
{
	var r = new XMLHttpRequest()
	r.open('GET', src, false)
	r.onreadystatechange = function ()
	{
		if (this.readyState != 4)
			return
		
		var script = document.createElement('script')
		document.body.appendChild(script)
		script.text = this.responseText
	}
	r.send(null)
}

})();
;(function(){

window.$$ = function (query, root)
{
	return Array.from((root || document).querySelectorAll(query))
}
window.$ = function (query, root)
{
	return (root || document).querySelector(query)
}

$.id = function (id) { return document.getElementById(id) }

$.onload = function (f) { return window.addEventListener('load', f, false) }
$.onready = function (f) { document.addEventListener('DOMContentLoaded', f, false) }
$.script = function (src)
{
	var node = document.createElement('script')
	node.type = 'text/javascript'
	node.src = src
	document.getElementsByTagName('head')[0].appendChild(node)
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

if (Liby.Request)
{
	$.get = Liby.Request.get
	$.post = Liby.Request.post
}

if (Liby.NodesBuilder)
{
	$.n = function (node) { return new Liby.NodesBuilder(node) }
}

})();

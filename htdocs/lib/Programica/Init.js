
// defining spaces
if (!self.Programica) self.Programica = {}

function log () {}

// preparing DOM prototypes
if (!self.Element)
	Element = {}

if (!Element.prototype)
	Element.prototype = document.createElement('div').__proto__ || {}

if (!self.HTMLFormElement)
	HTMLFormElement = {}

if (!HTMLFormElement.prototype)
	HTMLFormElement.prototype = document.createElement('form').__proto__ || {}


// base objects extensions
if (!Object.extend)
	Object.extend = function (d, s) { for (var p in s) d[p] = s[p]; return d }

if (!Math.longRandom)
	Math.longRandom = function () { return (new Date()).getTime().toString() + Math.round(Math.random() * 1E+17) }

if (!String.localeCompare)
	String.localeCompare = function (a, b) { return a < b ? -1 : (a > b ? 1 : 0) }

if (!Array.prototype.forEach)
	Array.prototype.forEach = function (f, inv) { for (var i = 0, len = this.length; i < len; i++) f.call(inv, this[i], i, this) }


function $   (id)   { return document.getElementById(id) }
function $E  (type, props)
{
	var node = document.createElement(type)
	if (props)
		for (var i in props)
			node.setAttribute(i, props[i])
	return node
}

$.onload = function (fn) { return self.addEventListener('load', fn, false) }
$.include = function (src)
{
	var node = document.createElement('script')
	node.type = 'text/javascript'
	node.src = src
	document.getElementsByTagName('head')[0].appendChild(node)
	return node
}


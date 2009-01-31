// defining spaces
if (!self.Programica) self.Programica = {}

// preparing DOM prototypes
if (!self.Element)
	self.Element = {}

if (!self.Element.prototype)
	self.Element.prototype = document.createElement('div').__proto__ || {}

if (!self.HTMLFormElement)
	self.HTMLFormElement = {}

if (!self.HTMLFormElement.prototype)
	self.HTMLFormElement.prototype = document.createElement('form').__proto__ || {}


// base objects extensions
if (!Object.extend)
	Object.extend = function (d, s) { if (d) for (var p in s) d[p] = s[p]; return d }

if (!Object.copy)
	Object.copy = function (s) { var d = {}; for (var k in s) d[k] = s[k]; return d }

if (!Object.keys)
	Object.keys = function (s) { var r = []; for (var k in s) r.push(k); return r }

if (!Math.longRandom)
	Math.longRandom = function () { return (new Date()).getTime().toString() + Math.round(Math.random() * 1E+17) }

if (!String.localeCompare)
	String.localeCompare = function (a, b) { return a < b ? -1 : (a > b ? 1 : 0) }

if (!Array.prototype.forEach)
	Array.prototype.forEach = function (f, inv) { for (var i = 0, len = this.length; i < len; i++) f.call(inv, this[i], i, this) }

if (!Array.prototype.indexOf)
	Array.prototype.indexOf = function(v, i)
	{
		var len = this.length,
			i = Number(i) || 0
		i = (i < 0) ? (Math.ceil(i) + len) : Math.floor(i)
		
		for (; i < len; i++)
			if (i in this && this[i] === v)
				return i
		return -1
	}


if (!Array.prototype.map)
	Array.prototype.map = function(f, inv)
	{
		var len = this.length,
			res = new Array(len)
		for (var i = 0; i < len; i++)
			if (i in this)
				res[i] = f.call(inv, this[i], i, this)
		return res
	}

if (!Array.copy)
	Array.copy = function (src) { return Array.prototype.slice.call(src) }

if (!Function.prototype.delay)
	Function.prototype.delay = function (delay, args, inv) { var me = this; return setTimeout(function () { return me.apply(inv, args || arguments) }, delay || 10) }

if (!Function.prototype.bind)
	Function.prototype.bind = function (inv, args) { var me = this; return function () { me.apply(inv, args || arguments) } }


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

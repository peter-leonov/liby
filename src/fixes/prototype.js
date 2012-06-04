;(function(){

function add (d, s)
{
	if (!d)
		return d
	
	for (var k in s)
	{
		if (k in d)
			continue
		
		d[k] = s[k]
	}
	
	return d
}

function extend (d, s)
{
	if (!d)
		return d
	
	for (var k in s)
		d[k] = s[k]
	
	return d
}

function copy (s)
{
	var d = {}
	
	for (var k in s)
		d[k] = s[k]
	
	return d
}

function keys (s)
{
	var r = []
	
	for (var k in s)
		r.push(k)
	
	return r
}

function keysCount (s)
{
	var l = 0
	
	for (var k in s)
		l++
	
	return l
}

function values (s)
{
	var r = []
	
	for (var k in s)
		r.push(s[k])
	
	return r
}

function isEmpty (s)
{
	for (var k in s)
		return false
	
	return true
}

function defineProperty (o, p, c)
{
	if (c.get)
		o.__defineGetter__(p, c.get)
	
	if (c.set)
		o.__defineSetter__(p, c.set)
}

add(Object, {add: add, extend: extend, copy: copy, keys: keys, keysCount: keysCount, values: values, isEmpty: isEmpty})

var o = {}
if (!Object.defineProperty && o.__defineGetter__ && o.__defineSetter__)
	Object.defineProperty = defineProperty

})();


;(function(){

function localeCompare (a, b)
{
	if (a < b)
		return -1
	if (a > b)
		return 1
	
	return 0
}

function trim ()
{
	return this.replace(/^\s+|\s+$/g, '')
}

function capitalize ()
{
	return this.charAt(0).toUpperCase() + this.substr(1)
}

Object.add(String.prototype, {trim: trim, capitalize: capitalize, localeCompare: localeCompare})

})();


;(function(){

function mixIn (module)
{
	return Object.extend(this.prototype, module.prototype)
}

function extend (s)
{
	for (var k in s)
		this[k] = s[k]
	
	return this
}

function bind (inv, args)
{
	var f = this
	function wrapper ()
	{
		f.apply(inv, args || arguments)
	}
	return wrapper
}

Object.add(Function.prototype, {mixIn: mixIn, extend: extend, bind: bind})

})();


;(function(){

var ceil = Math.ceil, floor = Math.floor

function indexOf (v, i)
{
	var len = this.length
	
	i = +i
	
	if (i)
	{
		if (i < 0)
			i = ceil(i) + len
		else
			i = floor(i)
	}
	else
	{
		i = 0
	}
	
	for (; i < len; i++)
		if (i in this && this[i] === v)
			return i
	
	return -1
}

function forEach (f, inv)
{
	for (var i = 0, il = this.length; i < il; i++)
		f.call(inv, this[i], i, this)
}

function map (f, inv)
{
	var res = []
	
	for (var i = 0, il = this.length; i < il; i++)
		if (i in this)
			res[i] = f.call(inv, this[i], i, this)
	
	return res
}

var slice = Array.prototype.slice
function copy (ary)
{
	return slice.call(ary)
}

Object.add(Array.prototype, {indexOf: indexOf, forEach: forEach, map: map})
Object.add(Array, {copy: copy})

})();


;(function(){

var meta = /([\\\.\*\+\?\$\^\|\(\)\[\]\{\}])/g

function escape (str)
{
	return ('' + str).replace(meta, '\\$1')
}

Object.add(RegExp, {escape: escape})

})();

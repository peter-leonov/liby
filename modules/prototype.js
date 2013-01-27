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

var hasOwnProperty = Object.prototype.hasOwnProperty
function keys (s)
{
	var r = []
	
	for (var k in s)
		if (hasOwnProperty.call(s, k))
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

add(Object, {add: add, extend: extend, copy: copy, keys: keys, keysCount: keysCount, values: values, isEmpty: isEmpty})

})();


;(function(){

function trim ()
{
	return this.replace(/^\s+|\s+$/g, '')
}

function capitalize ()
{
	return this.charAt(0).toUpperCase() + this.substr(1)
}

Object.add(String.prototype, {trim: trim, capitalize: capitalize})

})();


;(function(){

function mixIn (module)
{
	Object.extend(this.prototype, module.prototype)
	return this
}

function bind (inv)
{
	var args = Array.from(arguments).slice(1)
	
	var f = this
	function wrapper ()
	{
		return f.apply(inv, args.concat(Array.from(arguments)))
	}
	return wrapper
}

function async (timeout)
{
	var f = this
	return function asyncWrapper ()
	{
		var that = this, args = arguments
		return window.setTimeout(function () { f.apply(that, args) }, timeout)
	}
}


Object.add(Function.prototype, {mixIn: mixIn, bind: bind, async: async})

})();


;(function(){

function from (list)
{
	var ary = []
	
	for (var i = 0, il = list.length; i < il; i++)
		ary[i] = list[i]
	
	return ary
}

Object.add(Array, {from: from})

})();


;(function(){

var meta = /([\\\.\*\+\?\$\^\|\(\)\[\]\{\}])/g

function escape (str)
{
	return ('' + str).replace(meta, '\\$1')
}

Object.add(RegExp, {escape: escape})

})();

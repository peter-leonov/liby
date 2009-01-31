

// base objects extensions
if (!Object.extend)
	Object.extend = function (d, s) { if (d) for (var k in s) d[k] = s[k]; return d }

if (!Object.copy)
	Object.copy = function (s) { var d = {}; for (var k in s) d[k] = s[k]; return d }

if (!Object.keys)
	Object.keys = function (s) { var r = []; for (var k in s) r.push(k); return r }

if (!Object.values)
	Object.values = function (s) { var r = []; for (var k in s) r.push(s[k]); return r }

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


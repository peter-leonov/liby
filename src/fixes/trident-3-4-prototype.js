(function(){

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

var Ap = Array.prototype
Ap.indexOf = indexOf
Ap.forEach = forEach
Ap.map = map


var Sp = String.prototype
var substr = Sp.substr
Sp.substr = function  (start, length)
{
	if (start < 0)
		start = this.length + start
	
	return substr.call(this, start, length)
}


})();
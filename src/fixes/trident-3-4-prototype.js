(function(){

if (!Array.copy)
Array.copy = function (s)
{
	try
	{
		return Array.prototype.slice.call(s)
	}
	catch (ex) {}
	
	
	var d = []
	
	if (!s)
		return d
	
	for (var i = 0, len = s.length; i < len; i++)
		d[i] = s[i]
	
	return d
}

if (!Array.prototype.indexOf)
Array.prototype.indexOf = function (v, i)
{
	var len = this.length
	
	if ((i = +i))
	{
		if (i < 0)
			i = ceil(i) + len
		else
			i = floor(i)
	}
	else
		i = 0
	
	for (; i < len; i++)
		if (i in this && this[i] === v)
			return i
	
	return -1
}

var sp = String.prototype
var substr = sp.substr
sp.substr = function  (start, length)
{
	if (start < 0)
		start = this.length + start
	
	return substr.call(this, start, length)
}


})();
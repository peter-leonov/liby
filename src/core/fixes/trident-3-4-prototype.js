(function(){

if (!Array.copy)
Array.copy = function (s)
{
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


})();
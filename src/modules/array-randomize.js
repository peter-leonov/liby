;(function(){

var random = Math.random

Array.prototype.randomize = function ()
{
	for (var i = 0, il = this.length; i < il; i++)
	{
		var j = (random() * il) >> 0
		var v = this[j]
		this[j] = this[i]
		this[i] = v
	}
	
	return this
}

Array.prototype.random = function (n)
{
	if (n <= 0)
		return []
	
	var copy = this.slice()
	
	var len = copy.length
	
	if (n > len)
		n = len
	
	var res = []
	
	for (var i = 0; i < n; i++)
	{
		var r = (random() * len) >> 0
		
		res[i] = copy[r]
		len--
		copy[r] = copy[len]
	}
	
	return res
}

})();
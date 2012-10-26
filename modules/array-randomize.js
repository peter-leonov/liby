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
	
	if (n == 1)
		return [this[(random() * this.length) >> 0]]
	
	// n > 1
	return this.slice().fetchRandom(n)
}

Array.prototype.fetchRandom = function (n)
{
	var len = this.length
	
	if (n > len)
		n = len
	
	var res = []
	
	for (var i = 0; i < n; i++)
	{
		var r = (random() * len) >> 0
		
		res[i] = this[r]
		len--
		this[r] = this[len]
	}
	
	this.length = len
	
	return res
}

})();
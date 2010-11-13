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
	var len = this.length
	
	if (n > len)
		n = len
	
	if (n > 1)
	{
		var copy = this.slice()
		copy.randomize()
		return n === len ? copy : copy.slice(0, n)
	}
	
	if (n === 1)
		return [this[(random() * len) >> 0]]
	
	// n <= 0
	return []
}

})();
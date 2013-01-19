;(function(){

var Math_random = Math.random

function shuffle ()
{
	var l = this.length
	var n = l
	
	var copy = this.slice(),
		shuffled = this
	// inline the same algorithm
	for (var i = 0; i < n; i++)
	{
		var r = (Math_random() * l) >> 0
		shuffled[i] = copy[r]
		copy[r] = copy[--l]
	}
	
	return shuffled
}


function random (n)
{
	n >>= 0 // to int or zero (not NaN)
	if (n <= 0)
		return []
	
	var l = this.length
	
	if (n == 1)
		return [this[(Math_random() * l) >> 0]]
	
	if (n > l)
		n = l
	
	var copy = this.slice(),
		shuffled = new Array(n)
	// inline the same algorithm
	for (var i = 0; i < n; i++)
	{
		var r = (Math_random() * l) >> 0
		shuffled[i] = copy[r]
		copy[r] = copy[--l]
	}
	
	return shuffled
}

Liby.carefullyExtend(Array.prototype, {shuffle: shuffle, random: random})

})();

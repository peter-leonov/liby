;(function(){

var Math_random = Math.random

function randomize (ary)
{
	for (var i = 0, il = ary.length; i < il; i++)
	{
		var j = (Math_random() * il) >> 0
		var v = ary[j]
		ary[j] = ary[i]
		ary[i] = v
	}
	
	return ary
}

function random (ary, n)
{
	if (n <= 0)
		return []
	
	if (n == 1)
		return [ary[(Math_random() * ary.length) >> 0]]
	
	// n > 1
	return fetchRandom(ary.slice(), n)
}

function fetchRandom (ary, n)
{
	var len = ary.length
	
	if (n > len)
		n = len
	
	var res = []
	
	for (var i = 0; i < n; i++)
	{
		var r = (Math_random() * len) >> 0
		
		res[i] = ary[r]
		len--
		ary[r] = ary[len]
	}
	
	ary.length = len
	
	return res
}

Liby.ArrayRandom =
{
	randomize: randomize, random: random, fetchRandom: fetchRandom
}

})();

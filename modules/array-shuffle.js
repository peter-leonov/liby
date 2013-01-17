;(function(){

var Math_random = Math.random

function shuffle ()
{
	var l = this.length
	
	var copy = this.slice()
	for (var i = 0, il = l; i < il; i++)
	{
		var r = (Math_random() * l) >> 0
		
		this[i] = copy[r]
		l--
		copy[r] = copy[l]
	}
	
	return this
}

function shuffleHard ()
{
	var l = this.length
	
	var random = new Array(l),
		index = new Array(l)
	
	for (var i = 0; i < l; i++)
	{
		random[i] = Math_random()
		index[i] = i
	}
	
	index.sort(function (a, b) { return random[a] - random[b] })
	
	var copy = this.slice()
	for (var i = 0; i < l; i++)
		this[i] = copy[index[i]]
	
	return this
}

function random (n)
{
	if (n <= 0)
		return []
	
	if (n == 1)
		return [this[(Math_random() * this.length) >> 0]]
	
	// n > 1
	return this.slice().shuffle().slice(0, n)
}

Liby.ArrayRandom =
{
	shuffleHard: shuffleHard,
	shuffle: shuffle,
	
	random: random
}

})();

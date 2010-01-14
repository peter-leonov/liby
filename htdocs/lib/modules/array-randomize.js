;(function(){

var random = Math.random

Array.prototype.randomize = function ()
{
	for (var v, i = 0, il = this.length; i < il; i++)
	{
		var j = (random() * il) >> 0
		v = this[j]
		this[j] = this[i]
		this[i] = v
		// t.log(j)
	}
	
	return this
}

})();
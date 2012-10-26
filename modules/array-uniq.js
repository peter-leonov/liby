;(function(){

if (Array.prototype.uniq)
	return

function uniq ()
{
	var res = []
	
	var j = 0
	for (var i = 0, il = this.length; i < il; i++)
	{
		var v = this[i]
		if (res.indexOf(v) == -1)
			res[j++] = v
	}
	
	return res
}

Array.prototype.uniq = uniq

})();

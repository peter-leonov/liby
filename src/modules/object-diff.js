;(function(){

if (!Object.diff)
Object.diff = function (a, b)
{
	var add = {}, change = {}, remove = {}, total = 0
	
	if (a !== b)
	{
		for (var k in b)
			if (k in a)
			{
				if (a[k] !== b[k])
				{
					change[k] = b[k]
					total++
				}
			}
			else
			{
				add[k] = b[k]
				total++
			}
		
		for (var k in a)
			if (!(k in b))
			{
				remove[k] = a[k]
				total++
			}
	}
	
	return {add: add, change: change, remove: remove, total: total}
}

})();

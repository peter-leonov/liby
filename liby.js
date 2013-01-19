;(function(){

var Liby =
{
	carefullyAdd: function (to, from)
	{
		for (var k in from)
		{
			if (k in to)
				throw new Error('property "' + k + '" exists while carefully adding to ' + to)
			
			to[k] = from[k]
		}
		return to
	}
}

self.Liby = Liby

})();

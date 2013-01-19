;(function(){

var Liby =
{
	carefullyExtend: function (to, from)
	{
		for (var name in from)
		{
			if (name in to)
				throw new Error('property "' + name + '" exists while carefully extending ' + to)
			
			to[name] = from[name]
		}
		return to
	},
	
	carefullyAddMethods: function (to)
	{
		for (var i = 0, il = arguments.length; i < il; i++)
		{
			var f = arguments[i]
			
			var name = f.name
			if (name in to)
				throw new Error('property "' + name + '" exists while carefully adding methods to ' + to)
			
			to[name] = f
		}
		return to
	}
}

self.Liby = Liby

})();

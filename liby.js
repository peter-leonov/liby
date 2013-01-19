;(function(){

function Liby (m)
{
	var name = m.name
	if (!name)
		throw new Error('unnamed module: ' + m)
	
	if (Liby[name])
		throw new Error('duplicated module: ' + name)
	log(name)
	Liby[name] = m
}

Liby.carefullyAdd = function (to, from)
{
	for (var k in from)
	{
		if (k in to)
			throw new Error('property "' + k + '" exists while carefully adding to ' + to)
		
		to[k] = from[k]
	}
	return to
}

Liby.addMethods

Liby.carefullyAdd
(
	Function.prototype,
	{
		addMethods: function ()
		{
			var to = this.prototype
			for (var i = 0, il = arguments.length; i < il; i++)
			{
				var f = arguments[i]
				to[f.name] = f
			}
			return to
		},
		
		addStatics: function ()
		{
			var to = this
			for (var i = 0, il = arguments.length; i < il; i++)
			{
				var f = arguments[i]
				to[f.name] = f
			}
			return to
		}
	}
)

self.Liby = Liby

})();

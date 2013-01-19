;(function(){

function Liby (m)
{
	var name = m.name
	if (!name)
		throw new Error('unnamed module: ' + m)
	
	if (Liby[name])
		throw new Error('duplicated module: ' + name)
	
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

self.Liby = Liby

})();

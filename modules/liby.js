;(function(){

var Liby =
{
	module: function (m)
	{
		var name = m.name
		if (this[name])
			console.error('duplicated module "' + name + '"')
		
		this[name] = m
		
		return new Module(m)
	}
}



function Module (m)
{
	this.m = m
}

Module.prototype =
{
	needs: function ()
	{
		for (var i = 0, il = arguments.length; i < il; i++)
		{
			var name = arguments[i]
			if (this[name])
				continue
			
			console.error('module "' + this.m.name + '" needs missing module "' + name + '"')
		}
	}
}


self.Liby = Liby

})();

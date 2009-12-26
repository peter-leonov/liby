;(function(){

var myName = 'Module', count = 0,
	Me = self[myName] = function ()
	{
		this.links = []
	}

Me.prototype =
{
	mix: function (cls)
	{
		Object.add(cls.prototype, this.prototype)
		return this
	}
}

Me.create = function (name, proto)
{
	var module = new Me()
	module.className = name || '[anonymous ' + myName + ' ' + ++count + ']',
	module.prototype = proto || {}
	return module
}

Me.className = myName

Function.prototype.mixIn = function (module) { return module.mix(this) }

})();

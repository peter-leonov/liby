;(function(){

var myName = 'Class', count = 0,
	Me = self[myName] = function () {}

Me.create = function (name, proto, klass)
{
	if (!klass)
		klass = function () {}
	
	klass.className = name || '[anonymous ' + myName + ' ' + ++count + ']'
	klass.prototype = proto || new Me.Object()
	klass.prototype.constructor = klass
	
	return klass
}

Me.className = myName
Me.Object = function () {}
Me.Object.prototype = {}

})();



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

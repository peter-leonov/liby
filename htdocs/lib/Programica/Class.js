// Class
;(function(){

var myName = 'Class'
var Me = self[myName] = function (name, sup)
{
	var klass = function ()
	{
		this.constructor = klass//arguments.callee
		this.initialize.apply(this, arguments)
		// try { this.initialize.apply(this, arguments) }
		// catch (ex) { throw new Error(name + ': ' + ex.message) }
	}
	
	klass.name = name || '[anonimous ' + myName + ']'
	klass.prototype = new (sup || Me.Object)()
	klass.constructor = Me
	
	return klass
}

Me.name = myName
Me.Object = function () {}
Me.Object.prototype =
{
	initialize: function () {},
	extend: function (s) { if (s) for (var p in s) this[p] = s[p]; return this }
}

// Me.supercall(this, 'initialize', [limit])
Function.prototype.supercall = function (o, n, a) { this.prototype.constructor.prototype[n].apply(o, a) }

})();



// Module
;(function(){

var myName = 'Module'
var Me = self[myName] = function (name, proto)
{
	var module = function () { throw new Error(myName + ': can`t create direct instance of myself') }
	module.name = name || '[anonimous ' + myName + ']'
	module.constructor = Me
	if (proto)
		module.prototype = proto
	return module
}

Me.name = myName

Function.prototype.mixIn = function (cls)
{
	if (cls.constructor != Me)
		throw new Error('Function: can only mixIn modules')
	Object.extend(this.prototype, cls.prototype)
}

})();

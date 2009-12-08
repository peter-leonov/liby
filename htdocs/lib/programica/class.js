;(function(){

var myName = 'Class',
	Me = self[myName] = function () {}

Me.create = function (name, proto, klass)
{
	if (!klass)
		klass = function () {}
	
	klass.className = name || '[anonymous ' + myName + ']'
	klass.prototype = proto || new Me.Object()
	klass.prototype.constructor = klass
	
	return klass
}

Me.className = myName
Me.Object = function () {}
Me.Object.prototype = {}

})();



// Module
;(function(){

var myName = 'Module'
var Me = self[myName] = function (name, proto)
{
	var module = function () { throw new Error(myName + ': can`t create direct instances of myself') }
	module.className = name || '[anonimous ' + myName + ']'
	module.constructor = Me
	module.mix = function (cls) { Object.extend(cls.prototype, this.prototype); return this }
	
	if (proto)
		module.prototype = proto
	return module
}

Me.className = myName

Function.prototype.mixIn = function (module)
{
	if (module.constructor != Me)
		throw new Error('Function: can only mixIn modules')
	return module.mix(this)
}

})();

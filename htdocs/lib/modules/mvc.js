;(function(){

var myName = 'MVC'

function Me () {}

Me.prototype =
{
	__mvc_interlink: function ()
	{
		var constructor = this.constructor,
			model = this.model = new constructor.Model(),
			view = this.view = new constructor.View(),
			controller = this.controller = new constructor.Controller()
		
		model.view = controller.view = view
		view.controller = controller
		controller.model = model
		model.parent = view.parent = controller.parent = this
	},
	
	bind: function () {}
}

self[myName] = Me
Class.setup(myName, Me)

Me.Model = Class.create(myName + '.Model')
Me.View = Class.create(myName + '.View')
Me.Controller = Class.create(myName + '.Controller')

Me.setup = function (name, constructor)
{
	constructor.prototype = new Me()
	Class.setup(name, constructor)
	
	constructor.Model = Class.create(name + '.Model', new Me.Model())
	constructor.View = Class.create(name + '.View', new Me.View())
	constructor.Controller = Class.create(name + '.Controller', new Me.Controller())
	
	return constructor
}

Me.create = function (name)
{
	return this.setup(name, function () {})
}

})();

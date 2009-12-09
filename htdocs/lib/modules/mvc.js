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
	
	bind: function () {},
	initialize: function () {}
}

self[myName] = Me
Class.setup(myName, Me)

Me.Model = Class.create(myName + '.Model')
Me.View = Class.create(myName + '.View')
Me.Controller = Class.create(myName + '.Controller')

Me.setup = function (name, klass, parent)
{
	if (!parent)
		parent = Me
	
	klass.prototype = new parent()
	Class.setup(name, klass)
	
	klass.Model = Class.create(name + '.Model', new parent.Model())
	klass.View = Class.create(name + '.View', new parent.View())
	klass.Controller = Class.create(name + '.Controller', new parent.Controller())
	
	return klass
}

Me.create = function (name, parent)
{
	function klass ()
	{
		this.__mvc_interlink()
		this.initialize()
	}
	
	return this.setup(name, klass, parent)
}

})();

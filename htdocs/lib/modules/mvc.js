;(function(){

var myName = 'MVC', Me = self[myName] = Class.create(myName)
Me.prototype.extend
({
	initialize: function ()
	{
		var constructor = this.constructor,
			model = this.model = new constructor.Model(),
			view = this.view = new constructor.View(),
			controller = this.controller = new constructor.Controller()
		
		model.view = controller.view = view
		view.controller = controller
		controller.model = model
		model.parent = view.parent = controller.parent = this
		
		// arguments comes from new Widget(arguments) call
		this.bind.apply(this, arguments)
		
		return this
	},
	
	bind: function () {}
})

Me.Model = Class.create(myName + '.Model')
Me.View = Class.create(myName + '.View')
Me.Controller = Class.create(myName + '.Controller')

Me.create = function (name)
{
	var widget = Class.create(name, Me)
	widget.Model = Class.create(name + '.Model', this.Model)
	widget.View = Class.create(name + '.View', this.View)
	widget.Controller = Class.create(name + '.Controller', this.Controller)
	
	return widget
}

})();

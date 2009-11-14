// MVC
;(function(){

var myName = 'MVC'
var ME = self[myName] = Class(myName)
ME.prototype.extend
({
	initialize: function ()
	{
		var model = this.model = new this.constructor.Model(),
			view = this.view = new this.constructor.View(),
			controller = this.controller = new this.constructor.Controller()
		
		model.view = controller.view = view
		view.controller = controller
		controller.model = model
		model.parent = view.parent = controller.parent = this
		
		this.bind.apply(this, arguments)
		
		return this
	},
	
	bind: function () {}
})

ME.Model = Class(myName + '.Model')
ME.View = Class(myName + '.View')
ME.Controller = Class(myName + '.Controller')

ME.create = function (name)
{
	var widget = Class(name, ME)
	widget.Model = Class(name + '.Model', this.Model)
	widget.View = Class(name + '.View', this.View)
	widget.Controller = Class(name + '.Controller', this.Controller)
	
	return widget
}

})();

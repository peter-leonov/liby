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
	
	initialize: function () {}
}

self[myName] = Me
Me.className = myName

function Model () {}
Model.prototype.initialize = function () {}
Model.className = myName + '.Model'
Me.Model = Model

function View () {}
View.prototype.initialize = function () {}
View.className = myName + '.View'
Me.View = View

function Controller () {}
Controller.prototype.initialize = function () {}
Controller.className = myName + '.Controller'
Me.Controller = Controller


Me.setup = function (klass, name, parent)
{
	if (!parent)
		parent = Me
	
	klass.prototype = new parent()
	klass.className = name
	
	
	function Model ()
	{
		this.constructor = Model
		this.initialize.apply(this, arguments)
	}
	Model.className = name + '.Model'
	Model.prototype = new parent.Model()
	klass.Model = Model
	
	
	function View ()
	{
		this.constructor = View
		this.initialize.apply(this, arguments)
	}
	View.className = name + '.View'
	View.prototype = new parent.View()
	klass.View = View
	
	
	function Controller ()
	{
		this.constructor = Controller
		this.initialize.apply(this, arguments)
	}
	Controller.className = name + '.Controller'
	Controller.prototype = new parent.Controller()
	klass.Controller = Controller
	
	
	return klass
}

Me.create = function (name, parent)
{
	function klass ()
	{
		this.constructor = klass
		this.__mvc_interlink()
		this.initialize()
	}
	
	return this.setup(klass, name, parent)
}

})();

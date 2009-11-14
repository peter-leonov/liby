;(function(){

var myName = 'FocusTip'
var Me = self[myName] = Class(myName)

Me.prototype.extend
({
	filledClassName: 'filled',
	
	initialize: function (main)
	{
		this.nodes = {}
	},
	
	bind: function (main)
	{
		this.nodes.main = main
		this.nodes.inputs = $$('input[type="text"], textarea', main)
		this.addListeners()
		return this
	},
	
	addListeners: function ()
	{
		var me = this, inputs = this.nodes.inputs, input
		function focus (e) { me.focus(e.target) }
		function blur (e) { me.blur(e.target) }
		for (var i = 0; i < inputs.length; i++)
		{
			input = inputs[i]
			input.addEventListener('focus', focus, false)
			input.addEventListener('blur', blur, false)
			if (input.value)
				input.parentNode.addClassName(this.filledClassName)
		}
	},
	
	focus: function (input)
	{
		input.parentNode.addClassName(this.filledClassName)
	},
	
	blur: function (input)
	{
		if (!input.value)
			input.parentNode.removeClassName(this.filledClassName)
	}
})

})();
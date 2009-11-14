;(function(){

var myName = 'InputTip'
var Me = self[myName] = Class(myName)

Me.prototype.extend
({
	initialize: function (main)
	{
		this.nodes = {main:main}
		this.addListeners()
		this.filledClassName = 'filled'
		return this
	},
	
	addListeners: function ()
	{
		var me = this
		function check (e) { me.checkValue(e) }
		this.nodes.main.addEventListener('keydown', check, false)
		this.nodes.main.addEventListener('keypress', check, false)
	},
	
	checkValue: function (e)
	{
		var targ = e.target
		if (targ.nodeName != 'INPUT' || targ.parentNode.nodeName != 'LABEL')
			return false
		
		var me = this
		setTimeout(function () { me.valueChanged(targ) }, 1)
	},
	
	valueChanged: function (input)
	{
		var parent = input.parentNode
		if (input.value)
			parent.addClassName(this.filledClassName)
		else
			parent.removeClassName(this.filledClassName)
	}
})

})();

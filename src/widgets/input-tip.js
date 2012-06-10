;(function(){

var myName = 'InputTip'

function Me () {}

Me.prototype =
{
	filledClassName: 'filled',
	focusedClassName: 'focused',
	
	bind: function (nodes)
	{
		this.nodes = nodes
		
		var me = this
		function onvalue (e) { window.setTimeout(function () { me.checkValue(e.target) }, 0) }
		function onfocus (e) { me.focus(e.target) }
		function onblur (e) { me.blur(e.target) }
		
		for (var i = 0, il = nodes.length; i < il; i++)
		{
			var node = nodes[i]
			
			node.addEventListener('keypress', onvalue, false)
			node.addEventListener('focus', onfocus, false)
			node.addEventListener('blur', onblur, false)
		}
		
		return this
	},
	
	checkValue: function (node)
	{
		var parent = node.parentNode
		if (node.value === '')
			parent.classList.remove(this.filledClassName)
		else
			parent.classList.add(this.filledClassName)
		
	},
	
	focus: function (node)
	{
		node.parentNode.classList.add(this.focusedClassName)
	},
	
	blur: function (node)
	{
		node.parentNode.classList.remove(this.focusedClassName)
	}
}

Me.className = myName
self[myName] = Me

})();

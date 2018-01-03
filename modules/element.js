;(function(){

function toggleTo (cn, state)
{
	if (this.contains(cn) == state)
		return
	
	this.toggle(cn)
}

DOMTokenList.prototype.toggleTo = toggleTo

var prototype =
{
	empty: function ()
	{
		var node
		while (node = this.firstChild)
			this.removeChild(node)
	},
	
	remove: function ()
	{
		var parent = this.parentNode
		if (!parent)
			return
		
		parent.removeChild(this)
	},
	
	isParent: function (parent, root)
	{
		var node = this
		do
		{
			if (node === parent)
				return true
			if (node === root)
				break
		}
		while ((node = node.parentNode))
		
		return false
	},
	
	parentWithClass: function (cn, root)
	{
		if (!root)
			root = document.documentElement
		
		var node = this
		do
		{
			if (node.classList.contains(cn))
				return node
			if (node === root)
				break
		}
		while ((node = node.parentNode))
		
		return null
	},
	
	offsetPosition: function (root)
	{
		var node = this,
			left = 0, top = 0
		
		if (node == root)
			return {left: left, top: top}
		
		var parent, lastNode
		for (;;)
		{
			left += node.offsetLeft
			top += node.offsetTop
			
			parent = node.offsetParent
			if (parent && parent !== root)
			{
				lastNode = node
				node = parent
			}
			else
			{
				if (lastNode)
				{
					left -= lastNode.scrollLeft
					top -= lastNode.scrollTop
				}
				
				break
			}
		}
		
		return {left: left, top: top}
	}
}

Object.add(Element.prototype, prototype)

})();
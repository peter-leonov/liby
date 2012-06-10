;(function(){

function toggleTo (cn, state)
{
	if (!!this.contains(cn) == !!state)
		return
	
	this.toggle(cn)
}

DOMTokenList.prototype.toggleTo = toggleTo

var R = RegExp, rexCache = {}

Object.add
(
	Element.prototype,
	{
		hasClassName: function (cn)
		{
			var className = this.className
			if (className == cn)
				return true
			
			var rex = rexCache[cn]
			if (rex)
				rex.lastIndex = 0
			else
				rex = rexCache[cn] = new R('(?:^| +)(?:' + cn + '(?:$| +))+', 'g')
			
			return rex.test(className)
		},
		
		empty: function ()
		{
			var node
			while (node = this.firstChild)
				this.removeChild(node)
		},
		
		hide: function () { this.classList.add('hidden') },
		show: function () { this.classList.remove('hidden') },
		
		remove: function ()
		{
			var parent = this.parentNode
			return parent ? parent.removeChild(this) : this
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
)

})();
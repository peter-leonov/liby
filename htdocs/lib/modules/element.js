;(function(){

var R = RegExp, rexCache = {}

Object.add
(
	Element.prototype,
	{
		setClassName: function (cn)
		{
			this.className = cn
			return cn
		},
		
		addClassName: function (cn)
		{
			// this.removeClassName(cn)
			this.className += ' ' + cn
			return cn
		},
		
		removeClassName: function (cn)
		{
			var className = this.className
			if (className)
				this.className = className.replace(rexCache[cn] || (rexCache[cn] = new R('(?:^| +)(?:' + cn + '(?:$| +))+', 'g')), ' ')
								.replace(/^\s+|\s+$/g, '')
			return cn
		},
		
		toggleClassName: function (cn, state)
		{
			if (arguments.length < 2)
				state = !this.hasClassName(cn)
			
			this.removeClassName(cn)
			if (state) this.addClassName(cn)
		},
		
		hasClassName: function (cn)
		{
			var className = this.className
			return (className == cn || (rexCache[cn] || (rexCache[cn] = new R('(?:^| +)(?:' + cn + '(?:$| +))+'))).test(className))
		},
		
		empty: function ()
		{
			var node
			while (node = this.firstChild)
				this.removeChild(node)
		},
		
		hide: function () { this.addClassName('hidden') },
		show: function () { this.removeClassName('hidden') },
		
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
		}
	}
)

})();
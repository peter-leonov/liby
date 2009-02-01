;(function(){

var R = RegExp, classNameRexCache = {}

function bakeClassNameRex (cn) { return classNameRexCache[cn] = new R('(?:\\s+|^)' + cn + '(?:\\s+|$)', 'g') }

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
			if (this.className)
				this.className = this.className.replace(classNameRexCache[cn] || bakeClassNameRex(cn), ' ').replace(/^\s+|\s+$/g, '')
			return cn
		},
		
		hasClassName: function (cn)
		{
			return (this.className == cn || (classNameRexCache[cn] || bakeClassNameRex(cn)).test(this.className))
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
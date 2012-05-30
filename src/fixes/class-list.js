;(function(){

if (document.documentElement.classList)
	return

function ClassList (node)
{
	this.node = node
}

var R = RegExp, rexCache = {}

ClassList.prototype =
{
	add: function (cn)
	{
		var node = this.node
		
		var className = node.className
		if (!className)
			node.className = cn
		else
			node.className = className + ' ' + cn
		
		return cn
	},
	
	remove: function (cn)
	{
		var node = this.node
		
		var className = node.className
		if (className)
		{
			var rex = rexCache[cn]
			if (!rex)
			{
				// the following regexp has to be the exact copy of the regexp from hasClassName()
				// because these two methods have the same regexp cache
				rex = new R('(?:^| +)(?:' + cn + '(?:$| +))+', 'g')
				rexCache[cn] = rex
			}
			
			node.className = className.replace(rex, ' ').replace(/^\s+|\s+$/g, '') // trim
		}
		return cn
	},
	
	contains: function (cn)
	{
		var node = this.node
		
		var className = node.className
		if (className == cn)
			return true
		
		// the following regexp has to be the exact copy of the regexp from removeClassName()
		// because these two methods have the same regexp cache
		var rex = rexCache[cn]
		if (rex)
			rex.lastIndex = 0
		else
		{
			rex = new R('(?:^| +)(?:' + cn + '(?:$| +))+', 'g')
			rexCache[cn] = rex
		}
		
		return rex.test(className)
	},
	
	toggle: function (cn)
	{
		if (this.contains(cn))
			this.remove(cn)
		else
			this.add(cn)
	},
	
	toArray: function ()
	{
		var className = this.node.className
		if (!className)
			return []
		
		return className.replace(/^\s+|\s+$/g, '').split(/ +/)
	},
	
	item: function (n)
	{
		return this.toArray()[n]
	},
	
	getLength: function ()
	{
		return this.toArray().length
	}
}

ClassList.prototype.__defineGetter__('length', ClassList.prototype.getLength)

function getClassList ()
{
	var classList = this.__classList
	if (classList)
		return classList
	
	return this.__classList = new ClassList(this)
}

Element.prototype.__defineGetter__('classList', getClassList)

})();

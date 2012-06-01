;(function(){

function ClassList (node)
{
	this.node = node
	this.lastClassName = null
	this.lastAry = null
	this.length = 0
	
	var me = this
	function propertychange (e)
	{
		if (e.propertyName != 'className')
			return
		
		me.sync()
	}
	node.attachEvent('onpropertychange', propertychange)
}

var R = RegExp

var rexCache = {}
function getRex (cn)
{
	var rex = rexCache[cn]
	if (rex)
	{
		rex.lastIndex = 0
		return rex
	}
	
	return rexCache[cn] = new R('(?:^| +)(?:' + R.escape(cn) + '(?:$| +))+', 'g')
}

var aryCache = {}
function classNameToArray (cn)
{
	var ary = aryCache[cn]
	if (ary)
		return ary
	
	return aryCache[cn] = cn.replace(/^ +| +$/g, '').split(/ +/)
}

ClassList.prototype =
{
	add: function (cn)
	{
		var node = this.node
		
		var className = node.className
		if (!className)
		{
			node.className = cn
			return
		}
		
		if (className.substr(-1) == ' ')
		{
			node.className = className + cn
			return
		}
		
		node.className = className + ' ' + cn
	},
	
	remove: function (cn)
	{
		var node = this.node
		
		var className = node.className
		if (!className)
			return
		
		node.className = className.replace(getRex(cn), '∅').replace(/^∅|∅$/g, '').replace(/∅/g, ' ')
	},
	
	contains: function (cn)
	{
		var node = this.node
		
		var className = node.className
		if (className == cn)
			return true
		
		return getRex(cn).test(className)
	},
	
	toggle: function (cn)
	{
		if (this.contains(cn))
		{
			this.remove(cn)
			return false
		}
		
		this.add(cn)
		return true
	},
	
	toArray: function ()
	{
		var className = this.node.className
		if (!className)
			return []
		
		if (this.lastClassName == className)
			return this.lastAry
		
		var ary = this.lastAry = classNameToArray(className)
		this.lastClassName = className
		
		return ary
	},
	
	item: function (n)
	{
		var v = this.toArray()[n]
		return v === undefined ? null : v
	},
	
	sync: function ()
	{
		var ary = this.toArray()
		
		var length = this.length
		for (var i = 0; i < length; i++)
			this[i] = undefined
		
		var length = ary.length
		for (var i = 0; i < length; i++)
			this[i] = ary[i]
		
		this.length = length
	}
}

function getClassList ()
{
	var classList = this.__classList
	if (classList)
		return classList
	
	return this.__classList = new ClassList(this)
}

Object.defineProperty(Element.prototype, 'classList', {get: getClassList})

})();

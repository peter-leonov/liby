;(function(){

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

var ClassList_prototype =
{
	lastClassName: null,
	lastAry: null,
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
	
	toString: function ()
	{
		return this.node.className
	}
}

function Proxy (proto)
{
	for (var k in proto)
		this[k] = proto[k]
	
	this.toString = proto.toString
}
Proxy.prototype = DOMTokenList.prototype

function ClassList () {}
ClassList.prototype = new Proxy(ClassList_prototype)

window.CommonClassList = ClassList

})();

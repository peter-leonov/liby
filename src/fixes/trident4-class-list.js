<!--# include virtual="common-class-list.js" -->

;(function(){

function ClassList (node)
{
	this.node = node
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

var proto = ClassList.prototype = new CommonClassList()
proto.sync = function ()
{
	var ary = this.toArray()
	
	var length = this.length
	for (var i = 0; i < length; i++)
		this[i] = null
	
	var length = ary.length
	for (var i = 0; i < length; i++)
		this[i] = ary[i]
	
	this.length = length
}

for (var i = 0; i < 100; i++)
	proto[i] = null

function getClassList ()
{
	var classList = this.__classList
	if (classList)
		return classList
	
	return this.__classList = new ClassList(this)
}

Object.defineProperty(Element.prototype, 'classList', {get: getClassList})

})();

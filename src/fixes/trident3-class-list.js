;(function(){

window.DOMTokenList = function () {}

})();

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

function fixClassList (node)
{
	node.classList = new ClassList(node)
}

Element.__liby_fixHooks.push(fixClassList)

// signal about support before onload
document.documentElement.classList = true

})();

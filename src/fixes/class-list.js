<!--# include virtual="common-class-list.js" -->

;(function(){

if (document.documentElement.classList)
	return

function ClassList (node)
{
	this.node = node
}

ClassList.prototype = new CommonClassList()
ClassList.prototype.getLength = function ()
{
	return this.toArray().length
}


Object.defineProperty(ClassList.prototype, 'length', {get: ClassList.prototype.getLength})

function bakeItemGetter (n)
{
	return function () { return this.item(n) }
}

for (var i = 0; i < 100; i++)
	Object.defineProperty(ClassList.prototype, i, {get: bakeItemGetter(i)})


function getClassList ()
{
	var classList = this.__classList
	if (classList)
		return classList
	
	return this.__classList = new ClassList(this)
}

Object.defineProperty(Element.prototype, 'classList', {get: getClassList})

})();

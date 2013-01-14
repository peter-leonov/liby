<!--# include virtual="common-class-list.js" -->

;(function(){

if (document.documentElement.classList)
	return


var defineProperty
if (Object.defineProperty)
	defineProperty = function (o, p, c)
	{
		return Object.defineProperty(o, p, c)
	}
else if (Object.__defineGetter__)
	defineProperty = function (o, p, c)
	{
		if (c.get)
			o.__defineGetter__(p, c.get)
		
		if (c.set)
			o.__defineSetter__(p, c.set)
	}
else
	throw new Error('no support for any kind of getters and setters')


function ClassList (node)
{
	this.node = node
}

ClassList.prototype = new CommonClassList()
ClassList.prototype.getLength = function ()
{
	return this.toArray().length
}


defineProperty(ClassList.prototype, 'length', {get: ClassList.prototype.getLength})

function bakeItemGetter (n)
{
	return function () { return this.item(n) }
}

for (var i = 0; i < 100; i++)
	defineProperty(ClassList.prototype, i, {get: bakeItemGetter(i)})


function getClassList ()
{
	var classList = this.__classList
	if (classList)
		return classList
	
	return this.__classList = new ClassList(this)
}

defineProperty(Element.prototype, 'classList', {get: getClassList})

})();

<!--#include file="Sizzle.js" -->

window.$$ = Sizzle

// Element.prototype.getElementsByClassName=function(c){return $$('.'+c, this)}

if (!document.getElementsByClassName)
{
	// from prototype 1.5.1.1
	Element.prototype.getElementsByClassName = document.getElementsByClassName = function (className, tagName)
	{
		// geting elems with native function
		var children = this.getElementsByTagName(tagName || '*')
		// predeclaring vars
		var elements = [], child, l = 0
		// precompile regexp
		var rex = new RegExp("(?:\\s+|^)" + className + "(?:\\s+|$)")
		// length is constant, so caching its value
		var len = children.length
		
		// memory for array of nodes will be allocated only once
		elements.length = len
		for (var i = 0; i < len; i++)
		{
			// even caching the reference for children[i] gives us some nanoseconds ;)
			child = children[i]
			// just rely on RegExp engine
			if (rex.test(child.className))
			{
				// simple assignment
				elements[l] = child
				// simple increment
				l++
			}
		}
		// truncating garbage length
		elements.length = l
		
		return elements
	}
}

<!--#include virtual="sizzle.js" -->

window.$$ = function (query, scream)
{
	var res = Sizzle(query)
	if (!res.length && scream !== false)
		throw new Error('empty result for query "' + query + '"')
	return res
}

// Element.prototype.getElementsByClassName=function(c){return $$('.'+c, this)}

if (!document.getElementsByClassName)
{
	Element.prototype.getElementsByClassName = document.getElementsByClassName = function (className, tagName)
	{
		var children = this.getElementsByTagName(tagName || '*'),
			rex = new RegExp("(?:\\s+|^)" + className + "(?:\\s+|$)")
		
		var res = []
		for (var l = 0, i = 0, il = children.length; i < il; i++)
			if (rex.test(children[i].className))
				res[l++] = children[i]
		
		return res
	}
}

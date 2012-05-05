// inspired by Paul Young
// http://ajaxian.com/archives/creating-a-queryselector-for-ie-that-runs-at-native-speed
(function(){

if (document.querySelectorAll)
	return

var sheet = document.createStyleSheet('style')

function querySelectorAll (query)
{
	var queries = query.split(/\s*,\s*/)
	for (var i = 0, il = queries.length; i < il; i++)
	{
		var q = queries[i]
		sheet.addRule(q, 'bottom:-31337pt !important', i)
	}
	
	var all = this.all
	var result = []
	for (var i = 0, il = all.length; i < il; i++)
	{
		var node = all[i]
		if (node.currentStyle.bottom == '-31337pt')
			result.push(node)
	}
	
	for (var i = 0, il = queries.length; i < il; i++)
		sheet.removeRule(0)
	
	return result
}

function querySelector (query)
{
	var queries = query.split(/\s*,\s*/)
	for (var i = 0, il = queries.length; i < il; i++)
	{
		var q = queries[i]
		sheet.addRule(q, 'bottom:-31337pt !important', i)
	}
	
	var all = this.all
	var result = null
	for (var i = 0, il = all.length; i < il; i++)
	{
		var node = all[i]
		if (node.currentStyle.bottom == '-31337pt')
		{
			result = node
			break
		}
	}
	
	for (var i = 0, il = queries.length; i < il; i++)
		sheet.removeRule(0)
	
	return result
}

function getElementsByClassName (className)
{
	return this.querySelectorAll('.' + className)
}

document.querySelectorAll = Element.prototype.querySelectorAll = querySelectorAll
document.querySelector = Element.prototype.querySelector = querySelector
document.getElementsByClassName = Element.prototype.getElementsByClassName = getElementsByClassName

})();

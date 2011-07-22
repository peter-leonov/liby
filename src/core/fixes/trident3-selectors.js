// inspired by Paul Young
// http://ajaxian.com/archives/creating-a-queryselector-for-ie-that-runs-at-native-speed
(function(){

if (document.querySelectorAll)
	return

var sheet = document.createStyleSheet('style')

function querySelectorAll (query)
{
	sheet.addRule(query, 'bottom:-31337pt !important', 0)
	
	var all = this.all
	var result = []
	for (var i = 0, il = all.length; i < il; i++)
	{
		var node = all[i]
		if (node.currentStyle.bottom == '-31337pt')
			result.push(node)
	}
	
	sheet.removeRule(0)
	
	return result
}

function querySelector (query)
{
	sheet.addRule(query, 'bottom:-31337pt !important', 0)
	
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
	
	sheet.removeRule(0)
	
	return result
}

document.querySelectorAll = Element.prototype.querySelectorAll = querySelectorAll
document.querySelector = Element.prototype.querySelector = querySelector

})();
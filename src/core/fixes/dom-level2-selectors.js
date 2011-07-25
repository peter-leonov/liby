(function(){

if (document.querySelectorAll)
	return

var head = document.getElementsByTagName('head')[0]

var node = document.createElement('style')
node.name = 'liby selectors engine ;)'
head.appendChild(node)
var sheet = node.sheet

function querySelectorAll (query)
{
	sheet.insertRule(query + ' { margin-left:-31337px !important }', 0)
	
	var all = this.getElementsByTagName('*')
	var result = []
	for (var i = 0, il = all.length; i < il; i++)
	{
		var node = all[i]
		if (window.getComputedStyle(node, null).marginLeft == '-31337px')
			result.push(node)
	}
	
	sheet.deleteRule(0)
	
	return result
}

function querySelector (query)
{
	sheet.insertRule(query + ' { margin-left:-31337px !important }', 0)
	
	var all = this.getElementsByTagName('*')
	var result = null
	for (var i = 0, il = all.length; i < il; i++)
	{
		var node = all[i]
		if (window.getComputedStyle(node, null).marginLeft == '-31337px')
		{
			result = node
			break
		}
	}
	
	sheet.deleteRule(0)
	
	return result
}

document.querySelectorAll = Element.prototype.querySelectorAll = querySelectorAll
document.querySelector = Element.prototype.querySelector = querySelector

})();
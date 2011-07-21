// inspired by Paul Young
// http://ajaxian.com/archives/creating-a-queryselector-for-ie-that-runs-at-native-speed
(function(){

if (document.querySelectorAll)
	return

var head = document.getElementsByTagName('head')[0]

var node = document.createElement('style')
node.name = 'liby selectors engine ;)'
head.appendChild(node)
var sheet = node.styleSheet

function findAll (query, root)
{
	sheet.addRule(query, 'bottom:-31337pt !important', 0)
	
	var all = root.all
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

function find (query, root)
{
	sheet.addRule(query, 'bottom:-31337pt !important', 0)
	
	var all = root.all
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

document.querySelectorAll = function (query) { return findAll(query, document) }
document.querySelector = function (query) { return find(query, document) }

Element.prototype.querySelectorAll = function (query) { return findAll(query, this) }
Element.prototype.querySelector = function (query) { return find(query, this) }

})();
(function(){

if (!/Firefox\/[23]\.0\./.test(window.navigator.userAgent))
	return

if (document.querySelectorAll)
	return

var head = document.getElementsByTagName('head')[0]

var node = document.createElement('style')
node.name = 'liby selectors engine ;)'
head.appendChild(node)
var sheet = node.sheet

function findAll (query, root)
{
	sheet.insertRule(query + ' { bottom:-31337px !important }', 0)
	
	var all = root.getElementsByTagName('*')
	var result = []
	for (var i = 0, il = all.length; i < il; i++)
	{
		var node = all[i]
		if (window.getComputedStyle(node, null).bottom == '-31337px')
			result.push(node)
	}
	
	sheet.deleteRule(0)
	
	return result
}

function find (query, root)
{
	sheet.insertRule(query + ' { bottom:-31337px !important }', 0)
	
	var all = root.getElementsByTagName('*')
	var result = null
	for (var i = 0, il = all.length; i < il; i++)
	{
		var node = all[i]
		if (window.getComputedStyle(node, null).bottom == '-31337px')
		{
			result = node
			break
		}
	}
	
	sheet.deleteRule(0)
	
	return result
}

document.querySelectorAll = function (query) { return findAll(query, document) }
document.querySelector = function (query) { return find(query, document) }

Element.prototype.querySelectorAll = function (query) { return findAll(query, this) }
Element.prototype.querySelector = function (query) { return find(query, this) }

})();
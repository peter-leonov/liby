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

sheet.addRule('*', 'scrollbar-arrow-color:#000', 0)

function find (query, root)
{
	sheet.addRule(query, 'scrollbar-arrow-color:#123456', 1)
	window.scrollBy(0, 0)
	
	var all = root.all
	var result = []
	for (var i = 0, il = all.length; i < il; i++)
	{
		var node = all[i]
		if (node.currentStyle.scrollbarArrowColor == '#123456')
			result.push(node)
	}
	
	sheet.removeRule(1)
	
	return result
}

document.querySelectorAll = function (query) { return find(query, document) }
document.querySelector = function (query) { return find(query, document)[0] || null }

Element.prototype.querySelectorAll = function (query) { return find(query, this) }
Element.prototype.querySelector = function (query) { return find(query, this)[0] || null }

})();
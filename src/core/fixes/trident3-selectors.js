// inspired by Paul Young
// http://ajaxian.com/archives/creating-a-queryselector-for-ie-that-runs-at-native-speed
(function(){

if (document.querySelectorAll)
	return

var head = document.getElementsByTagName('head')[0]

var node, sheet
function bakeSheet ()
{
	if (node)
		head.removeChild(node)
	
	node = document.createElement('style')
	head.appendChild(node)
	sheet = node.styleSheet
}

var buffer = window.__liby__selector_buffer = []

var count = 0
function find (query)
{
	if (count++ % 50 == 0)
		bakeSheet()
	
	sheet.addRule(query, '-liby-selector-' + count + ':expression(window.__liby__selector_buffer[' + count + '].push(this))', 0)
	
	buffer[count] = []
	window.scrollBy(0, 0)
	
	var result = buffer[count] = []
	window.scrollBy(0, 0)
	
	buffer[count] = []
	sheet.removeRule(0)
	
	// alert(sheet.rules.length)
	
	return result
}

function findRelative (query, root)
{
	return find(query)
}

document.querySelectorAll = function (query) { return find(query) }
document.querySelector = function (query) { return find(query)[0] || null }

Element.prototype.querySelectorAll = function (query) { return findRelative(query, this) }
Element.prototype.querySelector = function (query) { return findRelative(query, this)[0] || null }

})();
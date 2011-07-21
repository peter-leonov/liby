// inspired by Paul Young
// http://ajaxian.com/archives/creating-a-queryselector-for-ie-that-runs-at-native-speed
(function(){

if (document.querySelectorAll)
	return

window.__liby__selector_nodes = []
var count = 0

function find (query)
{
	count++
	
	var node = document.createElement('style')
	document.documentElement.firstChild.appendChild(node)
	var style = node.styleSheet
	
	style.addRule(query, '-liby-selector-' + count + ':expression(window.__liby__selector_nodes[' + count + '].push(this))', 0)
	
	window.__liby__selector_nodes[count] = []
	window.scrollBy(0, 0)
	
	var result = window.__liby__selector_nodes[count] = []
	window.scrollBy(0, 0)
	
	window.__liby__selector_nodes[count] = []
	style.removeRule(0)
	
	document.documentElement.firstChild.removeChild(node)
	
	// alert(style.rules.length)
	
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
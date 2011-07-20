// inspired by Paul Young
// http://ajaxian.com/archives/creating-a-queryselector-for-ie-that-runs-at-native-speed
(function(){

if (document.querySelectorAll)
	return

var style = document.createStyleSheet()

window.__liby__selector_nodes = []
var count = 0

function find (query)
{
	count++
	
	var result = window.__liby__selector_nodes[count] = []
	style.addRule(query, '-liby-selector-' + count + ':expression(window.__liby__selector_nodes[' + count + '].push(this))', 0)
	
	window.scrollBy(0, 0)
	window.__liby__selector_nodes[count].length = 0
	window.scrollBy(0, 0)
	// window.__liby__selector_nodes = []
	// style.removeRule(0)
	
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
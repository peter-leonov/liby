// inspired by Paul Young
// http://ajaxian.com/archives/creating-a-queryselector-for-ie-that-runs-at-native-speed
(function(){

if (document.querySelectorAll)
	return

var style = document.createStyleSheet()

function find (query)
{
	window.__liby__selector_nodes = []
	
	style.addRule(query, '-liby-selector:expression(window.__liby__selector_nodes.push(this))', 0)
	window.scrollBy(0, 0)
	// get rid of the dirty expression ;)
	style.removeRule(0)
	
	return window.__liby__selector_nodes
}

document.querySelectorAll = function (query) { return find(query) }
document.querySelector = function (query) { return find(query)[0] || null }

})();
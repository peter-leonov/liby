;(function(){

function list2array (list)
{
	var arr = []
	for (var i = 0, il = list.length; i < il; i++)
		arr[i] = list[i]
	return arr
}

window.$$ = function (query, root)
{
	var list = (root || document).querySelectorAll(query)
	// if (!list || list.length == 0)
	// 	alert('empty $$("' + query + '")')
	return list2array(list)
}
window.$ = function (id) { return document.getElementById(id) }

})();

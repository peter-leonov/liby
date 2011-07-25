;(function(){

function list2array (list)
{
	var arr = []
	for (var i = 0, il = list.length; i < il; i++)
		arr[i] = list[i]
	return arr
}

window.$$ = function (query, root) { return list2array((root || document).querySelectorAll(query)) }
window.$ = function (id) { return document.getElementById(id) }

if (!document.getElementsByClassName)
{
	Element.prototype.getElementsByClassName = document.getElementsByClassName = function (className)
	{
		return this.querySelectorAll('.' + className)
	}
}

})();

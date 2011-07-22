function $$ (query, root) { return (root || document).querySelectorAll(query) }
function $  (query, root) { return (root || document).querySelector('#' + query) }

if (!document.getElementsByClassName)
{
	Element.prototype.getElementsByClassName = document.getElementsByClassName = function (className)
	{
		return this.querySelectorAll('.' + className)
	}
}

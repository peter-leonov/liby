function $$ (query) { return document.querySelectorAll(query) }
function $  (query) { return document.querySelector('#' + query) }

if (!document.getElementsByClassName)
{
	Element.prototype.getElementsByClassName = document.getElementsByClassName = function (className)
	{
		return this.querySelectorAll('.' + className)
	}
}

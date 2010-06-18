;(function(){

var doc = document, win = window

if (!win.Element)
	win.Element = function () {}

if (!win.HTMLScriptElement)
{
	win.HTMLScriptElement = function () {}
	win.HTMLScriptElement.prototype = new Element()
}


if (!win.HTMLInputElement)
{
	win.HTMLInputElement = function () {}
	win.HTMLInputElement.prototype = new Element()
}

})();
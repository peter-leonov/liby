;(function(){

var doc = document, win = window

if (!win.Element)
win.Element = function () {}

if (!win.HTMLScriptElement)
win.HTMLScriptElement = function () {}
win.HTMLScriptElement.prototype = new Element()

})();
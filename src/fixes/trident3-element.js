;(function(){

if (window.Element)
	return

window.Element = function () {}

})();


;(function(){

if (window.HTMLScriptElement)
	return

function Me () {}
Me.prototype = new Element()

window.HTMLScriptElement = Me

})();


;(function(){

if (window.HTMLInputElement)
	return

function Me () {}
Me.prototype = new Element()

window.HTMLInputElement = Me

})();


;(function(){

if (window.HTMLFormElement)
	return

function Me () {}
Me.prototype = new Element()

window.HTMLFormElement = Me

})();


;(function(){

if (window.HTMLImageElement)
	return

function Me () {}
Me.prototype = new Element()

window.HTMLImageElement = Me

})();

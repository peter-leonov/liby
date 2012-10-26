;(function(){

function Me () {}
window.Element = Me

})();


;(function(){

function Me () {}
Me.prototype = new Element()
window.HTMLScriptElement = Me

})();


;(function(){

function Me () {}
Me.prototype = new Element()
window.HTMLInputElement = Me

})();


;(function(){

function Me () {}
Me.prototype = new Element()
window.HTMLFormElement = Me

})();


;(function(){

function Me () {}
Me.prototype = new Element()
window.HTMLImageElement = Me

})();

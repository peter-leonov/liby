(function(){

var doc = document

if (!doc.defaultView)
	doc.defaultView = window
	
if (!doc.defaultView.getComputedStyle)
	doc.defaultView.getComputedStyle = function (node) { return node.currentStyle }

})();
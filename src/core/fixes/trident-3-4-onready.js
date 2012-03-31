(function(){

var doc = document

// based on jQuery onready for IE
// based on the trick by Diego Perini (http://javascript.nwbox.com/IEContentLoaded/)
function checkready ()
{
	try { doc.documentElement.doScroll('left') }
	catch (ex) { return }
	
	// run once
	clearInterval(checkready.interval)
	
	// Events must be fixed at this point to preserve handlers call order.
	// Element prototype and other fixes have subscribed erlier.
	var e = document.createEvent('Event')
	e.initEvent('DOMContentLoaded', false, false)
	document.dispatchEvent(e)
}
checkready.interval = setInterval(checkready, 100)

})();
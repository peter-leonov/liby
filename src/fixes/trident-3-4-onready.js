(function(){

var fired
function fireDCL ()
{
	// one more frontier
	if (fired)
		return
	fired = true
	
	// Events must be fixed at this point to preserve handlers call order.
	// Element prototype and other fixes have subscribed erlier.
	var e = document.createEvent('Event')
	e.initEvent('DOMContentLoaded', false, false)
	document.dispatchEvent(e)
}

// based on jQuery onready for IE
// based on the trick by Diego Perini (http://javascript.nwbox.com/IEContentLoaded/)
function checkready ()
{
	try { document.documentElement.doScroll('left') }
	catch (ex) { return }
	
	// run once
	window.clearInterval(interval)
	
	fireDCL()
}
var interval = window.setInterval(checkready, 100)

// safe fallback
window.addEventListener('load', fireDCL, false)

})();
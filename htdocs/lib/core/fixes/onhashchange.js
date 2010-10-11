if (!('onhashchange' in window)) //  || /Opera\/(9\.|10\.[0-5])/.test(navigator.userAgent)
(function(){

try { console.log('emulating window.onhashchange') } catch (ex) {}

// mark browser as supporting one
window.onhashchange = null

var location = window.location

var lastHash = location.hash
function check ()
{
	var hash = location.hash
	
	if (hash === lastHash)
		return
	lastHash = hash
	
	var e = document.createEvent('Event')
	e.initEvent('hashchange', true, false)
	document.dispatchEvent(e)
}

setInterval(check, 250)

})();

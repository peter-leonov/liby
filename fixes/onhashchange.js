if (!('onhashchange' in window) && !/Opera\/.+ Version\/1\d\.[6789]/.test(navigator.userAgent))
(function(){

// mark browser as supporting one
window.onhashchange = null

var lastHash = window.location.hash
function check ()
{
	var hash = window.location.hash
	
	
	if (hash === lastHash)
		return
	lastHash = hash
	
	var e = document.createEvent('Event')
	e.initEvent('hashchange', true, false)
	document.dispatchEvent(e)
}

var timer
function restart (d)
{
	window.clearInterval(timer)
	if (d < 0)
		return
	
	timer = window.setInterval(check, d || 500)
}

window.location.setHashchangeCheckInterval = restart

restart()
document.addEventListener('mouseup', function () { window.setInterval(function () { check() }, 0) }, true)

})();

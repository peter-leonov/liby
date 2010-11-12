if (/WebKit\//.test(navigator.userAgent))
window.addEventListener
(
	'mousewheel',
	function (e)
	{
	    // stop mousewheel event for all WebKits
		e.stopPropagation()
		
		var d = (- e.wheelDelta / 120).
			ne = document.createEvent('UIEvents')
		
		if (ne.initUIEvent)
			ne.initUIEvent('DOMMouseScroll', true, true, ne.view, d)
		else
			ne.initEvent('DOMMouseScroll', true, true, ne.view, d)
		
		for (var k in e)
			ne[k] = e[k]
		
		ne.detail = d
		
		if (!e.target.dispatchEvent(ne))
			e.preventDefault()
	},
	true
)
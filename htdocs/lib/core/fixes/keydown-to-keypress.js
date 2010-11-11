if (/WebKit\/|MSIE [6789]\./.test(navigator.userAgent))
(function(){

var status = {}

document.addEventListener
(
	'keydown',
	function (e)
	{
		var target = e.target
		
		var ne = document.createEvent('Event')
		ne.initEvent('keypress', true, true)
		
		// copying valueable data
		ne.altKey = e.altKey
		ne.ctrlKey = e.ctrlKey
		ne.metaKey = e.metaKey
		ne.charCode = e.charCode
		ne.keyCode = e.keyCode
		
		if (status[e.keyCode])
			e.stopPropagation()
		else
			status[e.keyCode] = true
		
		if (!target.dispatchEvent(ne))
			e.preventDefault()
	},
	true
)

document.addEventListener
(
	'keyup',
	function (e)
	{
		status[e.keyCode] = false
	},
	true
)

})();
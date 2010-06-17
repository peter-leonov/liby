if (/WebKit\//.test(navigator.userAgent))
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
		for (var k in e)
			ne[k] = e[k]
		
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
		delete status[e.keyCode]
	},
	true
)

})();
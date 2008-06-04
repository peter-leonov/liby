if (self.console && self.console.log)
	self.log = function ()
	{
		var arr = []
		for (var i = 0; i < arguments.length; i++)
			arr.push(arguments[i])
		return console.log(arr.join(', '))
	}


window.addEventListener
(
	'mousewheel',
	function (e)
	{
		// stop mousewheel event for all webkits
		e.stopPropagation()
		
		var d = (- e.wheelDelta / 120)
		var ne = document.createEvent('UIEvents')
		if (ne.initUIEvent)
			ne.initUIEvent('DOMMouseScroll', true, true, ne.view, d)
		else
			ne.initEvent('DOMMouseScroll', true, true, ne.view, d)
		
		Object.extend(ne, e)
		ne.detail = d
		
		if (!e.target.dispatchEvent(ne))
			e.preventDefault()
	},
	true
)

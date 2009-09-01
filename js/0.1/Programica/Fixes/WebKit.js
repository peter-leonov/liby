if (self.console && self.console.log && self.console.error)
{
	if (!self.log)
		self.log = function () { return self.console.log(Array.prototype.slice.call(arguments).join(', ')) }
	
	if (!self.reportError)
		self.reportError = function () { return self.console.error(Array.prototype.slice.call(arguments).join(', ')) }
}
else
	self.log = self.reportError = function () {  }

window.addEventListener
(
	'mousewheel',
	function (e)
	{
		// stop mousewheel event for all WebKits
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
;(function(){

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
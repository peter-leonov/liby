(function(){

var win = window

// fix for onload call order bug
var onLoadListeners = win.__iefixes_onLoadListeners = []

win.addEventListenerReal = win.addEventListener
win.addEventListener = function (type, func, dir)
{
	if (type == 'load')
	{
		this.removeEventListener(type, func, dir)
		onLoadListeners.push(func)
	}
	else
		this.addEventListenerReal(type, func, dir)
	
	return func
}

win.removeEventListenerReal = win.removeEventListener
win.removeEventListener = function (type, func, dir)
{
	if (type == 'load')
	{
		for (var i = 0; i < onLoadListeners.length; i++)
		{
			if (onLoadListeners[i] === func)
				onLoadListeners[i] = null
		}
	}
	else
		this.removeEventListenerReal(type, func, dir)
	
	return func
}

// we have already done the wrapper job
win.addEventListenerReal
(
	'load',
	function (e)
	{
		for (var i = 0; i < onLoadListeners.length; i++)
		{
			var listener = onLoadListeners[i]
			if (listener)
				listener.call(this, e)
		}
	},
	true
)

})();
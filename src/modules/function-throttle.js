;(function(){

function throttle (delay, timeout, invocant)
{
	var callback = this,
		delayTimer = 0,
		timeoutTimer = 0,
		args
	
	function fire ()
	{
		if (delayTimer)
		{
			window.clearTimeout(delayTimer)
			delayTimer = 0
		}
		
		if (timeoutTimer)
		{
			window.clearTimeout(timeoutTimer)
			timeoutTimer = 0
		}
		
		callback.apply(invocant, args)
	}
	
	function call ()
	{
		args = arguments
		
		if (delayTimer)
			window.clearTimeout(delayTimer)
		delayTimer = window.setTimeout(fire, delay)
		
		if (!timeoutTimer)
			timeoutTimer = window.setTimeout(fire, timeout)
	}
	
	return call
}

Function.prototype.throttle = throttle

})();

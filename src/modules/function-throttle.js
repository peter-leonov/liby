;(function(){

function throttle (soft, hard, invocant)
{
	var callback = this,
		softTimer = 0,
		hardTimer = 0,
		args
	
	function debounce ()
	{
		args = arguments
		
		if (softTimer)
			window.clearTimeout(softTimer)
		softTimer = window.setTimeout(fire, soft)
	}
	
	function throttle ()
	{
		args = arguments
		
		if (softTimer)
			window.clearTimeout(softTimer)
		softTimer = window.setTimeout(fire, soft)
		
		if (!hardTimer)
			hardTimer = window.setTimeout(fire, hard)
	}
	
	function fire ()
	{
		if (softTimer)
		{
			window.clearTimeout(softTimer)
			softTimer = 0
		}
		
		if (hardTimer)
		{
			window.clearTimeout(hardTimer)
			hardTimer = 0
		}
		
		callback.apply(invocant, args)
	}
	
	return hard ? throttle : debounce
}

Function.prototype.throttle = throttle

})();

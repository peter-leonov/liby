;(function(){

function throttle (soft, hard)
{
	var callback = this,
		softTimer = 0,
		hardTimer = 0,
		args, inv
	
	function debounce ()
	{
		args = arguments
		inv = this
		
		if (softTimer)
			window.clearTimeout(softTimer)
		softTimer = window.setTimeout(fire, soft)
	}
	
	function throttle ()
	{
		args = arguments
		inv = this
		
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
		
		callback.apply(inv, args)
	}
	
	return hard ? throttle : debounce
}

Function.prototype.throttle = throttle

})();

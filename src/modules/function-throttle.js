;(function(){

function throttle (soft, hard, invocant)
{
	var callback = this,
		softTimer = 0,
		hardTimer = 0,
		args
	
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
	
	function call ()
	{
		args = arguments
		
		if (softTimer)
			window.clearTimeout(softTimer)
		softTimer = window.setTimeout(fire, soft)
		
		if (!hardTimer && hard)
			hardTimer = window.setTimeout(fire, hard)
	}
	
	return call
}

Function.prototype.throttle = throttle

})();

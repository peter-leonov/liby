;(function(){

function throttle (soft, hard, invocant)
{
	var callback = this,
		softTimer = 0,
		hardTimer = 0,
		args
	
	function call ()
	{
		args = arguments
		
		if (softTimer)
			window.clearTimeout(softTimer)
		softTimer = window.setTimeout(fire, soft)
		
		if (!hardTimer && hard)
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
	
	return call
}

Function.prototype.throttle = throttle

})();

;(function(){

var myName = 'Throttler'

function Me (callback, delay, timeout, invocant)
{
	this.callback = callback
	this.delay = delay
	this.timeout = timeout
	this.invocant = invocant || self
	this.delayTimer = 0
	this.timeoutTimer = 0
	
	var me = this
	this.timeoutCallback = function () { me.fire() }
	this.timerCallback = function () { me.fire() }
}

Me.prototype =
{
	call: function ()
	{
		this.args = arguments
		
		clearTimeout(this.delayTimer)
		this.delayTimer = setTimeout(this.timerCallback, this.delay)
		
		if (!this.timeoutTimer)
			this.timeoutTimer = setTimeout(this.timeoutCallback, this.timeout)
	},
	
	fire: function ()
	{
		var delayTimer = this.delayTimer
		if (delayTimer)
		{
			clearTimeout(delayTimer)
			this.delayTimer = 0
		}
		
		var timeoutTimer = this.timeoutTimer
		if (timeoutTimer)
		{
			clearTimeout(timeoutTimer)
			this.timeoutTimer = 0
		}
		
		this.callback.apply(this.invocant, this.args)
	}
}

Me.className = myName
self[myName] = Me

})();

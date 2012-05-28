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
		
		window.clearTimeout(this.delayTimer)
		this.delayTimer = window.setTimeout(this.timerCallback, this.delay)
		
		if (!this.timeoutTimer)
			this.timeoutTimer = window.setTimeout(this.timeoutCallback, this.timeout)
	},
	
	fire: function ()
	{
		var delayTimer = this.delayTimer
		if (delayTimer)
		{
			window.clearTimeout(delayTimer)
			this.delayTimer = 0
		}
		
		var timeoutTimer = this.timeoutTimer
		if (timeoutTimer)
		{
			window.clearTimeout(timeoutTimer)
			this.timeoutTimer = 0
		}
		
		this.callback.apply(this.invocant, this.args)
	}
}

Me.className = myName
self[myName] = Me

})();

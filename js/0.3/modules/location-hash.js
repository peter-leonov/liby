;(function(){

var myName = 'LocationHash',
	Me = self[myName] = function () {}

Me.prototype =
{
	interval: 250,
	bind: function (location)
	{
		this.location = location
		this.lastHash = this.location.hash
		this.last = this.get()
		
		var me = this
		function check ()
		{
			// stop checking while are waiting to set timer
			if (this.setting)
				return
			
			if (me.location.hash != me.lastHash)
			{
				me.lastHash = me.location.hash
				me.dispatchEvent({type:'change', value:me.get(), last:me.last})
			}
		}
		
		this.checkTimer = setInterval(check, this.interval)
		document.addEventListener('click', function () { setTimeout(check, 10) }, true)
	},
	
	set: function (val)
	{
		val = String(val)
		if (this.last === val)
			return
		
		this.last = val
		
		this.setting = true
		var me = this
		function set ()
		{
			var hash = '#' + me.last
			// change only if it differs
			if (me.location.hash == hash)
				return
			
			me.lastHash = me.location.hash = hash
			me.setting = false
		}
		clearTimeout(this.setTimer)
		// deferred hash writing (to prevent luggish behavior)
		this.setTimer = setTimeout(set, 10)
	},
	
	get: function ()
	{
		return this.location.hash.replace(/^#/, '')
	}
}

EventDriven.mix(Me)

})();
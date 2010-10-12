;(function(){

var myName = 'LocationHash'

function Me ()
{
	
}

Me.prototype =
{
	bind: function (win)
	{
		if (!win)
			win = window
		
		var location = this.location = win.location
		var hash = this.hash = location.hash
		this.value = hash.substr(1)
	},
	
	set: function (v)
	{
		this.location.hash = v
		this.value = v
	},
	
	get: function ()
	{
		return this.value
	}
}

Me.mixIn(EventDriven)

Me.className = myName
self[myName] = Me

})();

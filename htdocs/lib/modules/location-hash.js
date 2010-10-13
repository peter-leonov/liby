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
		
		return this
	},
	
	set: function (v)
	{
		var str = '' + v
		this.location.hash = encodeURIComponent(str)
		this.value = str
	},
	
	get: function ()
	{
		var hash = this.location.hash
		var v = decodeURIComponent(hash.substr(1))
		this.value = v
		return v
	},
	
	getUndecoded: function ()
	{
		var hash = this.location.hash
		var v = hash.substr(1)
		this.value = v
		return v
	}
}

if (/Firefox\//.test(navigator.userAgent))
	Me.prototype.get = Me.prototype.getUndecoded


Me.mixIn(EventDriven)

Me.className = myName
self[myName] = Me

})();

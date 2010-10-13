;(function(){

var myName = 'LocationHash'

function Me () {}

Me.prototype =
{
	bind: function (win)
	{
		if (!win)
			win = window
		
		var location = this.location = win.location
		this.hash = location.hash
		
		return this
	},
	
	set: function (v)
	{
		this.location.hash = encodeURIComponent(v)
	},
	
	get: function ()
	{
		return decodeURIComponent(this.location.hash.substr(1))
	},
	
	getUndecoded: function ()
	{
		return this.location.hash.substr(1)
	}
}

if (/Firefox\//.test(navigator.userAgent))
	Me.prototype.get = Me.prototype.getUndecoded


Me.mixIn(EventDriven)

Me.className = myName
self[myName] = Me

})();

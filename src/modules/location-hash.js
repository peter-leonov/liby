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
		
		var me = this
		function onhashchange (e) { me.onhashchange() }
		win.addEventListener('hashchange', onhashchange, false)
		
		return this
	},
	
	onhashchange: function (e)
	{
		var hash = this.location.hash
		if (hash === this.hash)
			return
		this.hash = hash
		
		this.dispatchEventData('change')
	},
	
	set: function (v)
	{
		var location = this.location
		location.hash = encodeURIComponent(v)
		this.hash = location.hash
	},
	
	setRaw: function (v)
	{
		var location = this.location
		location.hash = v
		this.hash = location.hash
	},
	
	get: function ()
	{
		var hash = this.location.hash.substr(1)
		
		var v
		try
		{
			v = decodeURIComponent(hash)
		}
		catch (ex)
		{
			v = decodeURIComponent(hash.replace(/%/g, '%25'))
		}
		
		return v
	},
	
	getRaw: function ()
	{
		return this.location.hash.substr(1)
	}
}

if (/Firefox\//.test(navigator.userAgent))
	Me.prototype.get = Me.prototype.getRaw


Me.mixIn(EventDriven)

Me.className = myName
self[myName] = Me

})();

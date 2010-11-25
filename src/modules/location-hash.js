;(function(){

var myName = 'LocationHash'

function Me () {}

Me.prototype =
{
	bind: function (win)
	{
		if (!win)
			win = window
		
		var text = '#%20& '
		
		function decodesOnTheFly ()
		{
			var a = document.createElement('a')
			a.href = 'abc'
			a.hash = encodeURIComponent(text)
			return a.hash === '#' + text
		}
		
		if (decodesOnTheFly())
			Me.prototype.get = Me.prototype._getUndecoded
		
		var location = this.location = win.location
		this.value = this.get()
		
		var me = this
		function onhashchange (e) { me.onhashchange() }
		win.addEventListener('hashchange', onhashchange, false)
		
		return this
	},
	
	onhashchange: function (e)
	{
		var v = this.get()
		if (v === this.value)
			return
		this.value = v
		
		this.dispatchEventData('change')
	},
	
	set: function (v)
	{
		this.value = v
		this.location.hash = encodeURIComponent(v)
	},
	
	get: function ()
	{
		var v = this.location.hash.substr(1)
		
		try
		{
			return decodeURIComponent(v)
		}
		catch (ex)
		{
			return v
		}
	},
	
	_getUndecoded: function ()
	{
		return this.location.hash.substr(1)
	}
}

Me.mixIn(EventDriven)

Me.className = myName
self[myName] = Me

})();

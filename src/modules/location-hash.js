;(function(){

var myName = 'LocationHash'

function Me () {}

Me.prototype =
{
	encode: encodeURIComponent,
	decode: decodeURIComponent,
	
	bind: function (win)
	{
		if (!win)
			win = window
		
		var text = '#%20& '
		
		var encode = this.encode
		function decodesOnTheFly ()
		{
			var a = document.createElement('a')
			a.href = 'abc'
			a.hash = encode(text)
			return a.hash === '#' + text
		}
		
		if (decodesOnTheFly())
			Me.prototype.get = Me.prototype._getUndecoded
		
		function encodesOnTheFly ()
		{
			var a = document.createElement('a')
			a.href = 'abc'
			a.hash = text
			return a.hash === '#' + text
		}
		
		if (encodesOnTheFly())
			Me.prototype.set = Me.prototype._setUnencoded
		
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
		this.location.hash = '#' + this.encode(v)
	},
	
	_setUnencoded: function (v)
	{
		this.value = v
		this.location.hash = v
	},
	
	get: function ()
	{
		var v = this.location.hash.substr(1)
		
		try
		{
			return this.decode(v)
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

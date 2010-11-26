;(function(){

var myName = 'LocationHash'

function Me () {}

function dontTouch (v) { return v }

Me.prototype =
{
	encode: encodeURIComponent,
	decode: decodeURIComponent,
	
	bind: function (win)
	{
		if (!win)
			win = window
		
		var text = '###%20& юникод … +& '
		
		var encode = this.encode
		function decodesOnTheFly ()
		{
			var a = document.createElement('a')
			a.href = 'abc'
			a.hash = encode(text)
			return a.hash === '#' + text
		}
		
		if (decodesOnTheFly())
			Me.prototype.decode = dontTouch
		
		function encodeURIIsEnough ()
		{
			var a = document.createElement('a')
			a.href = 'abc'
			a.hash = '#' + encodeURI(text)
			return decodeURIComponent(a.hash) === '#' + text
		}
		
		if (encodeURIIsEnough())
			Me.prototype.encode = encodeURI
		
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
	}
}

Me.mixIn(EventDriven)

Me.className = myName
self[myName] = Me

})();

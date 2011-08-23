;(function(){

var myName = 'LocationHash'

function Me () {}

function dontTouch (v) { return v }

Me.prototype =
{
	encode: encodeURI,
	decode: decodeURIComponent,
	
	bind: function (win)
	{
		if (!win)
			win = window
		
		this.window = win
		
		function decodesOnTheFly ()
		{
			var a = document.createElement('a')
			a.href = 'abc'
			a.hash = encodeURIComponent('%26')
			return a.hash === '#%26'
		}
		
		if (decodesOnTheFly())
			Me.prototype.decode = dontTouch
		
		var me = this
		function onhashchange (e) { me.onhashchange() }
		win.addEventListener('hashchange', onhashchange, false)
		
		return this
	},
	
	onhashchange: function (e)
	{
		var v = this.get()
		if (this.manual)
		{
			this.manual = false
			return
		}
		
		this.dispatchEventData('change')
	},
	
	set: function (v)
	{
		this.window.location.hash = '#' + this.encode(v)
		this.manual = true
	},
	
	get: function ()
	{
		var v = this.window.location.hash.substr(1)
		
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

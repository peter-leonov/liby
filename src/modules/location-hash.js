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
		
		this.window = win
		
		var me = this
		function onhashchange (e) { me.onhashchange() }
		win.addEventListener('hashchange', onhashchange, false)
		
		return this
	},
	
	onhashchange: function (e)
	{
		if (this.manual)
		{
			this.manual = false
			return
		}
		
		this.dispatchEventData('change')
	},
	
	set: function (v)
	{
		this.manual = true
		this.window.location.href = '#' + this.encode(v)

		if (!v)
		{
			if ( typeof window.history.replaceState === 'function' )
				window.history.replaceState('page', '', window.location.href.replace( /#.*/, ""))
		}
	},
	
	get: function ()
	{
		var href = this.window.location.href
		var start = href.indexOf('#')
		if (start < 0)
			return ''
		
		var v = href.substr(start + 1)
		
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

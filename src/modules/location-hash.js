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
	
	eraseHash: function()
	{
		this.window.location.href = '#'
	},
	
	eraseHashEx: function()
	{
		this.window.location.href = '#'
		window.history.replaceState(null, null, this.window.location.pathname + this.window.location.search)
	},
	
	set: function (v)
	{
		this.manual = true

		if (v === '')
			this.eraseHash()
		else
			this.window.location.href = '#' + this.encode(v)			
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

if (window.history.pushState)
	Me.prototype.eraseHash = Me.prototype.eraseHashEx 

Me.mixIn(EventDriven)

Me.className = myName
self[myName] = Me

})();

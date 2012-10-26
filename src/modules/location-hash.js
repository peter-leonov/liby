;(function(){

var myName = 'LocationHash'

function Me () {}

Me.prototype =
{
	encode: function (str)
	{
		return (''+str).replace('%', '%25').replace(' ', '%20')
	},
	decode: decodeURIComponent,
	
	bind: function ()
	{
		var me = this
		function onhashchange (e) { me.onhashchange() }
		window.addEventListener('hashchange', onhashchange, false)
		
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
	
	eraseEmptyHash: function()
	{
		window.history.replaceState(null, null, window.location.pathname + window.location.search)
	},
	
	set: function (v)
	{
		this.manual = true
		
		if (v === '')
		{
			window.location.href = '#-'
			this.eraseEmptyHash()
			return
		}
		
		window.location.href = '#' + this.encode(v)
	},
	
	get: function ()
	{
		var href = window.location.href
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

if (!window.history.pushState)
	Me.prototype.eraseEmptyHash = function () {}

Me.mixIn(EventDriven)

Me.className = myName
self[myName] = Me

})();

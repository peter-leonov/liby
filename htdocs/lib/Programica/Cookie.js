
if (!self.Cookie) self.Cookie =
{
	set: function (name, value, daysToExpire)
	{
		var expire = ''
		if (typeof daysToExpire === 'number')
		{
			var d = new Date()
			d.setTime(d.getTime() + 86400000 * daysToExpire)
			expire = '; expires=' + d.toGMTString()
		}
		return document.cookie = escape(name) + '=' + escape(value || '') + expire
	},
	
	get: function (name)
	{
		var cookie = document.cookie.match(new RegExp('(^|;)\\s*' + escape(name) + '=([^;\\s]*)'))
		return (cookie ? unescape(cookie[2]) : null)
	},
	
	erase: function (name)
	{
		var cookie = this.get(name) || true
		this.set(name, '', -1)
		return cookie
	},
	
	accept: function ()
	{
		if (typeof navigator.cookieEnabled == 'boolean')
			return navigator.cookieEnabled
		
		this.set('__cookie_test', '1')
		return (this.erase('__cookie_test') == '1')
	}
}
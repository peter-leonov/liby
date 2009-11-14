var WindowName =
{
	get: function (key)
	{
		var hash = this.parse(decodeURIComponent(window.name))
		return hash ? hash[key] : undefined
	},
	
	set: function (key, val)
	{
		var hash = this.parse(decodeURIComponent(window.name)) || {}
		hash[key] = val
		window.name = encodeURIComponent(UrlEncode.stringify(hash))
		return val
	},
	
	clear: function () { window.name = "" },
	
	parse: function (val) { return UrlEncode.parse(val) }
}
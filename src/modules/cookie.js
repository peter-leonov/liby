;(function(){

var encode = escape, decode = unescape
	// encode = encodeURIComponent, decode = decodeURIComponent

var Me =
{
	set: function (name, value, expires, path)
	{
		var cookie = encode(name) + '=' + encode(value)
		
		if (expires !== undefined)
			cookie += '; expires=' + new Date(expires).toGMTString()
		
		if (path !== undefined)
			cookie += '; path=' + path
		
		document.cookie = cookie
		
		return value
	},
	
	get: function (name)
	{
		var value, cookie = new RegExp('(^|;)\\s*' + encode(name) + '=([^;\\s]*)').exec(document.cookie)
		return cookie ? decode(cookie[2]) : null
	},
	
	erase: function (name)
	{
		this.set(name, '', 0)
	},
	
	keys: function ()
	{
		var cookie, keys = [], rex = new RegExp('(?:^|;)\\s*([^=]+)=[^;\\s]*', 'g')
		while (cookie = rex.exec(document.cookie))
			keys.push(cookie[1])
		
		return keys
	},
	
	toHash: function ()
	{
		var hash = {}
		
		var keys = this.keys()
		for (var i = 0, il = keys.length; i < il; i++)
		{
			var k = keys[i]
			hash[k] = this.get(k)
		}
		
		return hash
	},
	
	clear: function ()
	{
		var keys = this.keys()
		for (var i = 0; i < keys.length; i++)
			this.erase(keys[i])
	}
}

Me.className = 'Cookie'
self[Me.className] = Me

})();
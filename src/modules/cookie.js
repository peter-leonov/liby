;(function(){

var myName = 'Cookie', doc = document,
	// encode = encodeURIComponent, decode = decodeURIComponent
	encode = escape, decode = unescape

if (!self[myName]) self[myName] =
{
	path: '/',
	set: function (name, value, expires, path)
	{
		var cookie = encode(name) + '=' + encode(value)
		
		if (expires !== undefined)
			cookie += '; expires=' + new Date(expires).toGMTString()
		
		if (path !== undefined)
			cookie += '; path=' + path
		
		doc.cookie = cookie
		
		return value
	},
	
	get: function (name)
	{
		var value, cookie = new RegExp('(^|;)\\s*' + encode(name) + '=([^;\\s]*)').exec(doc.cookie)
		return cookie ? decode(cookie[2]) : null
	},
	
	erase: function (name)
	{
		var cookie = this.get(name) || true
		this.set(name, '', 0)
		return cookie
	},
	
	keys: function ()
	{
		var cookie, keys = [], rex = new RegExp('(?:^|;)\\s*([^=]+)=[^;\\s]*', 'g')
		while (cookie = rex.exec(doc.cookie))
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

})();
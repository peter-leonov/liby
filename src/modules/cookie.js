;(function(){

var myName = 'Cookie', doc = document,
	// encode = encodeURIComponent, decode = decodeURIComponent
	encode = escape, decode = unescape

if (!self[myName]) self[myName] =
{
	path: '/',
	set: function (name, value, expires, path)
	{
		doc.cookie = encode(name) + '=' + encode(value) + '; expires=' + new Date(expires).toGMTString() + '; path=' + path
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
		this.set(name, '', -1)
		return cookie
	},
	
	keys: function ()
	{
		var cookie, keys = [], rex = new RegExp('(?:^|;)\\s*([^=]+)=[^;\\s]*', 'g')
		while (cookie = rex.exec(doc.cookie))
			keys.push(cookie[1])
		
		return keys
	},
	
	clear: function ()
	{
		var keys = this.keys()
		for (var i = 0; i < keys.length; i++)
			this.erase(keys[i])
	}
}

})();
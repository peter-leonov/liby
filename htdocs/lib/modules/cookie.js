;(function(){

var myName = 'Cookie', day = 864e5, doc = document,
	// encode = encodeURIComponent, decode = decodeURIComponent
	encode = escape, decode = unescape

if (!self[myName]) self[myName] =
{
	days: 30,
	path: '/',
	set: function (name, value, days, path)
	{
		var d = new Date()
		days = days || this.days
		path = path || this.path
		
		d.setTime(d.getTime() + day * days)
		doc.cookie = encode(name) + '=' + encode(this.stringify(value)) + '; expires=' + d.toGMTString() + '; path=' + path
		return value
	},
	
	get: function (name)
	{
		var value, cookie = new RegExp('(^|;)\\s*' + encode(name) + '=([^;\\s]*)').exec(doc.cookie)
		return cookie ? this.parse(decode(cookie[2])) : null
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
	},
	
	stringify: function (value) { return value },
	parse: function (value) { return value }
}

})();
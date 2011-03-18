;(function(){

var Me =
{
	load: function ()
	{
		return UrlEncode.parse(decodeURIComponent(window.name))
	},
	
	save: function (hash)
	{
		window.name = encodeURIComponent(UrlEncode.stringify(hash))
	},
	
	get: function (k)
	{
		var hash = this.load()
		return hash ? hash[k] : undefined
	},
	
	set: function (k, v)
	{
		var hash = this.load()
		hash[k] = v
		this.save(hash)
		return v
	},
	
	remove: function (k)
	{
		var hash = this.load()
		var v = hash[k]
		delete hash[k]
		this.save(hash)
		return v
	},
	
	length: function (k)
	{
		var hash = this.load()
		
		var l = 0
		for (var k in hash)
			l++
		
		return l
	},
	
	keys: function (k)
	{
		var hash = this.load()
		
		var keys = []
		for (var k in hash)
			keys.push(k)
		
		return keys
	},
	
	clear: function ()
	{
		window.name = ''
	}
}

Me.className = 'WindowName'
self[Me.className] = Me

})();
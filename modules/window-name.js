;(function(){

var Me =
{
	init: function ()
	{
		for (var w = window; w.parent != w; w = w.parent);
		this.window = w
	},
	
	load: function ()
	{
		return UrlEncode.parse(decodeURIComponent(this.window.name))
	},
	
	save: function (hash)
	{
		this.window.name = encodeURIComponent(UrlEncode.stringify(hash))
	},
	
	get: function (k)
	{
		var hash = this.load()
		return hash ? hash['x' + k] : undefined
	},
	
	set: function (k, v)
	{
		var hash = this.load()
		hash['x' + k] = '' + v
		this.save(hash)
		return v
	},
	
	remove: function (k)
	{
		var hash = this.load()
		var v = hash['x' + k]
		delete hash['x' + k]
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
			keys.push(k.substr(1))
		
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
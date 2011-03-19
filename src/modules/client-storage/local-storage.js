;(function(){

var Papa = ClientStorage

function Me ()
{
	Papa.call(this)
	this.constructor = Me
}

Me.prototype = new Papa()

Me.methods =
{
	init: function ()
	{
		return this.data = window.localStorage
	},
	
	get: function (k)
	{
		// https://bugs.webkit.org/show_bug.cgi?id=30996
		// to not to interfere with data method names
		k = 'x' + k
		return this.data.getItem(k)
	},
	
	set: function (k, v)
	{
		k = 'x' + k
		this.data.setItem(k, '' + v)
		return v
	},
	
	remove: function (k)
	{
		k = 'x' + k
		var data = this.data
		
		var v = data.getItem(k)
		data.removeItem(k)
		return v
	},
	
	length: function ()
	{
		return this.data.length
	},
	
	keys: function ()
	{
		var data = this.data
		
		var keys = []
		for (var i = 0, il = data.length; i < il; i++)
			keys[i] = data.key(i).substr(1)
		
		return keys
	},
	
	clear: function ()
	{
		this.data.clear()
	}
}

Object.extend(Me.prototype, Me.methods)

Me.className = 'LocalStorage'
Papa[Me.className] = Me

Papa.addBackend(Me)

})();
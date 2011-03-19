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
		var WN = window.WindowName
		if (WN)
		{
			WN.init()
			return this.data = window.WindowName
		}
	},
	
	get: function (k)
	{
		var v = this.data.get(k)
		return v === undefined ? null : v
	},
	
	set: function (k, v)
	{
		return this.data.set(k, v)
	},
	
	remove: function (k)
	{
		var v = this.data.remove(k)
		return v === undefined ? null : v
	},
	
	length: function ()
	{
		return this.data.length()
	},
	
	keys: function ()
	{
		return this.data.keys()
	},
	
	clear: function ()
	{
		return this.data.clear()
	}
}

Object.extend(Me.prototype, Me.methods)

Me.className = 'WindowName'
Papa[Me.className] = Me

Papa.addBackend(Me)

})();
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
		return this.data = window.WindowName
	},
	
	get: function (k)
	{
		return this.data.get(k)
	},
	
	set: function (k, v)
	{
		this.data.set(k, v)
		return v
	},
	
	remove: function (k)
	{
		return this.data.get(k)
	},
	
	length: function ()
	{
		return this.data.length
	},
	
	keys: function ()
	{
		return []
	},
	
	clear: function ()
	{
		return []
	}
}

Object.extend(Me.prototype, Me.methods)

Me.className = 'WindowName'
Papa[Me.className] = Me

Papa.addBackend(Me)

})();
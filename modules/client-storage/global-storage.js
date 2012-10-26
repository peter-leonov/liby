;(function(){

var Papa = ClientStorage

function Me ()
{
	Papa.call(this)
	this.constructor = Me
}

Me.prototype = new Papa.LocalStorage()

Me.methods =
{
	init: function ()
	{
		var data = window.globalStorage
		return this.data = data && data[location.hostname]
	},
	
	get: function (k)
	{
		k = 'x' + k
		var v = this.data.getItem(k)
		return v === null ? null : v.value
	},
	
	remove: function (k)
	{
		k = 'x' + k
		var data = this.data
		
		var v = data.getItem(k)
		if (v !== null)
			v = v.value
		data.removeItem(k)
		return v
	},
	
	clear: function ()
	{
		var data = this.data
		
		for (var i = 0, il = data.length; i < il; i++)
			// get the first key at every iteration
			data.removeItem(data.key(0))
	}
}

Object.extend(Me.prototype, Me.methods)

Me.className = 'GlobalStorage'
Papa[Me.className] = Me

Papa.addBackend(Me)

})();
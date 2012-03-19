;(function(){

var Papa = ClientStorage

function Me ()
{
	Papa.call(this)
	this.constructor = Me
}

Me.prototype = new Papa()

var counter = 0

Me.methods =
{
	init: function ()
	{
		return navigator.plugins && navigator.plugins['Shockwave Flash']
	},
	
	proxySrc: '/liby/modules/client-storage/flash-9/proxy.swf',
	
	bind: function ()
	{
		var div = document.createElement('div')
		var id = 'client-storage-' + ++counter
		div.innerHTML = '<object class="client-storage" id="' + id + '" name="' + id + '" data="' + this.proxySrc + '"></object>'
		var movie = div.firstChild
		document.body.appendChild(movie)
		
		var me = this
		movie.onready = function ()
		{
			me.data = movie
			me.onready()
		}
	},
	
	get: function (k)
	{
		var v = this.data.getItem(this.encode(k))
		return v === undefined ? null : this.decode(v)
	},
	
	set: function (k, v)
	{
		this.data.setItem(this.encode(k), this.encode(v))
		return v
	},
	
	remove: function (k)
	{
		var v = this.get(k)
		this.data.removeItem(this.encode(k))
		return v
	},
	
	length: function ()
	{
		return this.data.length()
	},
	
	keys: function ()
	{
		var keys = this.data.keys()
		for (var i = 0, il = keys.length; i < il; i++)
			keys[i] = this.decode(keys[i])
		return keys
	},
	
	clear: function (k)
	{
		this.data.clear()
	}
}

Object.extend(Me.prototype, Me.methods)

Me.className = 'Flash9'
Papa[Me.className] = Me

Papa.addBackend(Me)

})();
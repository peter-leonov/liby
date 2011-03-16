;(function(){

var Papa

;(function(){

var Me =
{
	backends: [],
	addBackend: function (o)
	{
		this.backends.push(o)
	},
	
	bind: function ()
	{
		// try to bind one backend by one
		for (var i = 0; i < this.backends.length; i++)
		{
			var backend = new this.backends[i]
			if (backend.bind())
				return this.backend = backend
		}
	},
	
	state: 'init',
	listeners: [],
	ready: function (f)
	{
		var state = this.state
		if (state == 'ready')
		{
			setTimeout(f, 0)
			return
		}
		
		this.listeners.push(f)
		
		if (state == 'init')
		{
			var me = this
			this.backend.ready(function () { me.onready() })
		}
	},
	onready: function ()
	{
		this.state = 'ready'
		
		var listeners = this.listeners
		for (var i = 0; i < listeners.length; i++)
			setTimeout(listeners[i], 0)
		
		this.listeners.length = 0
	},
	
	get: function (k) { return this.backend.get(k) },
	set: function (k, v) { return this.backend.set(k, v) },
	remove: function (k) { return this.backend.remove(k) },
	length: function () { return this.backend.length() },
	keys: function () { return this.backend.keys() },
	clear: function () { return this.backend.clear() }
}

Me.className = 'ClientStorage'
self[Me.className] = Me
Papa = Me

})();


;(function(){

function Me () {}

Me.prototype =
{
	bind: function ()
	{
		return this.data = window.localStorage
	},
	
	ready: function (f)
	{
		setTimeout(f, 0)
	},
	
	get: function (k)
	{
		return this.data.getItem(k)
	},
	set: function (k, v)
	{
		this.data.setItem(k, v)
		return v
	},
	remove: function (k)
	{
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
			keys[i] = data.key(i)
		
		return keys
	},
	clear: function ()
	{
		var data = this.data
		
		var keys = []
		for (var i = 0, il = data.length; i < il; i++)
		{
			// get the first key at every iteration
			var k = data.key(0)
			keys[i] = k
			delete data[k]
		}
		return keys
	}
}

Papa.addBackend(Me)

Me.className = 'LocalStorage'
Papa[Me.className] = Me

})();


;(function(){

function Me () {}

Me.prototype =
{
	bind: function ()
	{
		return this.data = window.globalStorage[location.hostname]
	},
	
	ready: function (f)
	{
		setTimeout(f, 0)
	},
	
	get: function (k)
	{
		return this.data.getItem(k)
	},
	set: function (k, v)
	{
		this.data.setItem(k, v)
		return v
	},
	remove: function (k)
	{
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
			keys[i] = data.key(i)
		
		return keys
	},
	clear: function ()
	{
		var data = this.data
		
		var keys = []
		for (var i = 0, il = data.length; i < il; i++)
		{
			// get the first key at every iteration
			var k = data.key(0)
			keys[i] = k
			delete data[k]
		}
		return keys
	}
}

Papa.addBackend(Me)

Me.className = 'GlobalStorage'
Papa[Me.className] = Me

})();


})();
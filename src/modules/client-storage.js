;(function(){

var Papa

;(function(){

function Me ()
{
	this.state = 'init'
	this.listeners = []
}

Me.prototype =
{
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
			this.bind()
	},
	
	bind: function (e)
	{
		this.onready()
	},
	
	onready: function ()
	{
		this.state = 'ready'
		
		var listeners = this.listeners
		for (var i = 0; i < listeners.length; i++)
			setTimeout(listeners[i], 0)
		
		this.listeners.length = 0
	}
}

Me.staticMethods =
{
	backends: [],
	addBackend: function (o)
	{
		this.backends.push(o)
	},
	
	guess: function ()
	{
		// try to init one backend by one
		for (var i = 0; i < this.backends.length; i++)
		{
			var backend = new this.backends[i]
			if (backend.init())
				return this.backend = backend
		}
	}
}

Object.extend(Me, Me.staticMethods)

Me.className = 'ClientStorage'
self[Me.className] = Me
Papa = Me

})();


;(function(){

function Me ()
{
	Papa.call(this)
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

Object.extend(Me.prototype, Me.methods)

Papa.addBackend(Me)

Me.className = 'LocalStorage'
Papa[Me.className] = Me

})();


;(function(){

function Me ()
{
	Papa.call(this)
}

Me.prototype = new Papa()

Me.methods =
{
	init: function ()
	{
		return this.data = window.globalStorage[location.hostname]
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

Object.extend(Me.prototype, Me.methods)

Papa.addBackend(Me)

Me.className = 'GlobalStorage'
Papa[Me.className] = Me

})();


})();
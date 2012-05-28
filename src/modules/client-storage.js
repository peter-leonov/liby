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
			window.setTimeout(f, 0)
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
			window.setTimeout(listeners[i], 0)
		
		this.listeners.length = 0
	},
	
	encode: function (k)
	{
		return ('x' + k).replace(/\W/g, function (m) { return '-' + m.charCodeAt(0) + '-' })
	},
	
	decode: function (k)
	{
		return k.substr(1).replace(/-(\d+)-/g, function (m, a) { return String.fromCharCode(a) })
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
				return backend
		}
	}
}

Object.extend(Me, Me.staticMethods)

Me.className = 'ClientStorage'
self[Me.className] = Me

})();
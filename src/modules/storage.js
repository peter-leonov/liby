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
			var backend = this.backends[i]
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

Me.className = 'Storage'
self[Me.className] = Me
Papa = Me

})();


;(function(){

var Me =
{
	bind: function ()
	{
		return this.data = window.localStorage || window.globalStorage[location.hostname]
	},
	
	ready: function (f)
	{
		setTimeout(f, 0)
	},
	
	get: function (k)
	{
		return this.data[k]
	},
	set: function (k, v)
	{
		return this.data[k] = v
	},
	remove: function (k)
	{
		var data = this.data
		
		var v = data[k]
		delete data[k]
		return v
	},
	length: function ()
	{
		var l = 0
		for (var k in this.data)
			l++
		return l
	},
	keys: function ()
	{
		var keys = []
		for (var k in this.data)
			keys.push(k)
		return keys
	},
	clear: function ()
	{
		var data = this.data
		
		var keys = []
		for (var k in data)
		{
			keys.push(k)
			delete data[k]
		}
		return keys
	}
}

Papa.addBackend(Me)

Me.className = 'Web'
Papa[Me.className] = Me

})();


})();
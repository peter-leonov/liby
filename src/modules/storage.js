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
	}
}

Me.className = 'Storage'
self[Me.className] = Me
Papa = Me

})();

})();
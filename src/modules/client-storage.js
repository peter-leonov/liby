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
Papa = Me

})();


;(function(){

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
		var keys = this.keys()
		this.data.clear()
		return keys
	}
}

Object.extend(Me.prototype, Me.methods)

Me.className = 'LocalStorage'
Papa[Me.className] = Me

Papa.addBackend(Me)

})();


;(function(){

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
		
		var keys = []
		for (var i = 0, il = data.length; i < il; i++)
		{
			// get the first key at every iteration
			var k = data.key(0)
			keys[i] = k.substr(1)
			data.removeItem(k)
		}
		return keys
	}
}

Object.extend(Me.prototype, Me.methods)

Me.className = 'GlobalStorage'
Papa[Me.className] = Me

Papa.addBackend(Me)

})();


;(function(){

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
		return !!document.body.addBehavior
	},
	
	proxySrc: '/favicon.ico',
	
	bind: function ()
	{
		var iframe = document.createElement('iframe')
		document.getElementsByTagName('head')[0].appendChild(iframe)
		iframe.id = 'client-storage-by-userData'
		iframe.src = this.proxySrc
		
		var me = this
		iframe.onreadystatechange = function ()
		{
			if (iframe.readyState != 'complete')
				return
			
			me.node = iframe.contentWindow.document.body
			me.node.addBehavior("#default#userData")
			
			me.onready()
		}
	},
	
	load: function ()
	{
		var node = this.node
		node.load('client-storage')
		return node.XMLDocument.documentElement
	},
	
	save: function ()
	{
		this.node.save('client-storage')
	},
	
	get: function (k)
	{
		return this.load().getAttribute(this.encode(k))
	},
	
	set: function (k, v)
	{
		this.load().setAttribute(this.encode(k), '' + v)
		this.save()
		return v
	},
	
	remove: function (k)
	{
		k = this.encode(k)
		var data = this.load()
		
		var v = data.getAttribute(k)
		data.removeAttribute(k)
		this.save()
		return v
	},
	
	length: function ()
	{
		return this.load().attributes.length
	},
	
	keys: function ()
	{
		var keys = []
		
		var attributes = this.load().attributes
		for (var i = 0, il = attributes.length; i < il; i++)
			keys[i] = this.decode(attributes[i].name)
		
		return keys
	},
	
	clear: function (k)
	{
		var keys = []
		
		var data = this.load(), attributes = data.attributes
		for (var i = 0, il = attributes.length; i < il; i++)
		{
			// get the first key at every iteration
			var name = attributes[0].name
			keys[i] = this.decode(name)
			
			data.removeAttribute(name)
		}
		
		this.save()
		
		return keys
	}
}

Object.extend(Me.prototype, Me.methods)

Me.className = 'UserData'
Papa[Me.className] = Me

Papa.addBackend(Me)

})();


;(function(){

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
		return true
	},
	
	proxySrc: '/lib-0.3/modules/client-storage/proxy.swf',
	
	bind: function ()
	{
		var movie = document.createElement('object')
		document.body.appendChild(movie)
		movie.id = movie.name = 'client-storage-by-userData'
		movie.data = this.proxySrc
		
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
		var keys = this.keys()
		this.data.clear()
		return keys
	}
}

Object.extend(Me.prototype, Me.methods)

Me.className = 'Flash9'
Papa[Me.className] = Me

Papa.addBackend(Me)

})();


})();
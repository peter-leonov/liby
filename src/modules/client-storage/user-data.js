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
		return !!document.body.addBehavior
	},
	
	proxySrc: '/favicon.ico',
	
	bind: function ()
	{
		var iframe = document.createElement('iframe')
		document.getElementsByTagName('head')[0].appendChild(iframe)
		iframe.id = 'client-storage-' + ++counter
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
		var data = this.load(), attributes = data.attributes
		for (var i = 0, il = attributes.length; i < il; i++)
			// get the first key at every iteration
			data.removeAttribute(attributes[0].name)
		
		this.save()
	}
}

Object.extend(Me.prototype, Me.methods)

Me.className = 'UserData'
Papa[Me.className] = Me

Papa.addBackend(Me)

})();
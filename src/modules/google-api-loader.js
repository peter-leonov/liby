;(function(){

var myName = 'GoogleApiLoader'

function Me (keys, host, language)
{
	this.host = /[^.]+\.[^.]+$/i.exec(host || location.host)
	this.state = 'init'
	this.apis = []
	this.language = language || (self.LanguagePack ? LanguagePack.code : 'en')
	this.keys = keys
	this.prerequisites = {}
}

Me.prototype =
{
	load: function (name, version)
	{
		if (name)
			this.apis.push({name: name, version: version})
		
		var me = this
		
		if (this.state == 'init')
		{
			if (!this.keys)
				throw new Error(myName + ': keys is undefined')
			
			this.node = $.load('http://www.google.com/jsapi?key=' + this.keys[this.host])
			
			function wait ()
			{
				if (!window.google)
					return
				
				clearInterval(timer)
				me.apiLoaderLoaded()
			}
			
			var timer = setInterval(wait, 250)
			
			this.state = 'loading'
		}
		
		if (this.state == 'ready')
			window.setTimeout(function () { me.fireAll() }, 1)
			
		return this
	},
	
	apiLoaderLoaded: function ()
	{
		this.state = 'ready'
		this.apiLoaded({name: 'loader'}, window.google['loader'])
		
		this.fireAll()
	},
	
	fireAll: function ()
	{
		for (var i = 0; i < this.apis.length; i++)
			this.loadApi(this.apis[i])
		
		this.apis.length = 0
	},
	
	loadApi: function (api)
	{
		var me = this
		function callback (e)
		{
			me.apiLoaded(api)
		}
		
		var opts =
		{
			nocss: true,
			language: this.language,
			callback: callback
		}
		
		window.google.load(api.name, api.version, opts)
	},
	
	apiLoaded: function (api)
	{
		this.dispatchEvent({type: api.name, api: window.google[api.name]})
	}
}

Me.mixIn(EventDriven)

Me.className = myName
self[myName] = Me

})();

// GoogleApiLoader
;(function(){

var myName = 'GoogleApiLoader'
var Me = self[myName] = Class(myName)

Me.mixIn(EventDriven)

Me.prototype.extend
({
	initialize: function (keys, hostname, language)
	{
		this.hostname = hostname || location.hostname
		this.state = 0
		this.apis = []
		this.language = language || (self.LanguagePack ? LanguagePack.code : 'en')
		this.keys = keys
		this.prerequisites = {}
	},
	
	load: function (name, version)
	{
		if (name)
			this.apis.push({name: name, version: version})
		
		var me = this, timer
		
		if (this.state === 0)
		{
			if (!this.keys)
				throw new Error(myName + ': keys is undefined')
			
			this.node = $.include('http://www.google.com/jsapi?key=' + this.keys[this.hostname])
			
			timer = setInterval(function () { if (self.google) clearInterval(timer), me.apiLoaderLoaded(self.google) }, 250)
			
			this.state = 1
		}
		
		if (this.state === 2)
			setTimeout(function () { me.fireAll() }, 10)
			
		return this
	},
	
	apiLoaderLoaded: function (google)
	{
		this.state = 2
		this.google = google
		this.apiLoaded({name: 'loader'}, this.google['loader'])
		
		this.fireAll()
	},
	
	fireAll: function ()
	{
		var i, me = this
		for (i = 0; i < this.apis.length; i++)
			(function (api) { me.google.load(api.name, api.version, {nocss: true, language: me.language, callback: function () { me.apiLoaded(api) }}) })(this.apis[i])
		
		this.apis.length = 0
	},
	
	apiLoaded: function (api)
	{
		this.dispatchEvent({type: api.name, api: this.google[api.name]})
	}
})

})();

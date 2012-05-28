(function(){

function chooseXMLHTTP ()
{
	var classes = ['Msxml2.XMLHTTP.6.0', 'Msxml2.XMLHTTP.3.0', 'Msxml2.XMLHTTP', 'Microsoft.XMLHTTP']
	for (var i = 0; i < classes.length; i++)
	{
		try { new ActiveXObject(classes[i]); return classes[i] }
		catch (ex) {}
	}
	throw new Error('This browser does not support XMLHttpRequest.')
}

var XMLHTTP = chooseXMLHTTP()

var Me = self.XMLHttpRequest = function ()
{
	// this.__r saves real request object
	var me = this, r = this.__r = new ActiveXObject(XMLHTTP)
	r.onreadystatechange = function () { me.__onreadystatechange() }
}


Me.prototype =
{
	// defaults
	readyState: 0,
	responseXML: null,
	responseText: '',
	status: 0,
	statusText: '',
	onreadystatechange: null,
	
	// method wrappers
	open: function (method, uri, async, user, password)
	{
		this.__async = async
		return this.__r.open(method, uri, async, user, password)
	},
	
	send: function (data)
	{
		if (this.__async)
		{
			var me = this
			window.setTimeout(function () { me.__r.send(data) }, 0)
			// __r.send() is wrapped in timer because of #97
		}
		else
			this.__r.send(data)
	},
	
	setRequestHeader: function (header, value) { return this.__r.setRequestHeader(header, value) },
	abort: function () { return this.__r.abort() },
	overrideMimeType: function (type) { return this.__r.overrideMimeType(type) },
	getAllResponseHeaders: function () { return this.__r.getAllResponseHeaders() },
	getResponseHeader: function (header) { return this.__r.getResponseHeader(header) },
	
	// properties wrappers
	__onreadystatechange: function ()
	{
		var r = this.__r
		this.readyState = r.readyState
		
		if (r.readyState === 4)
		{
			this.status = r.status || 0 // 0 for direct file loading from filesystem
			this.statusText = r.statusText
			
			this.responseXML = r.responseXML
			this.responseText = r.responseText
			
			if (!this.responseXML.documentElement && r.responseStream)
				this.responseXML.load(r.responseStream)
		}
		
		
		
		if (this.onreadystatechange)
			this.onreadystatechange()
		
		return false
	}
}


})();
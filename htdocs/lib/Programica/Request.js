if (!self.Programica)
	self.Programica = {}

Programica.Request = function (prms)
{
	for (var p in prms)
		if (this[p] === undefined)
			this[p] = prms[p]
	
	// this.transport saves real request object
	
	if (self.XMLHttpRequest) // Gecko, WebKit, Presto...
	{
		try
		{
			this.transport = new XMLHttpRequest()
			if (this.transport.overrideMimeType)
				this.transport.overrideMimeType('application/xml')
		}
		catch (ex) {}
	}
	else if (self.ActiveXObject) // Trident
	{
		// microsux
		try { this.transport = new ActiveXObject("Msxml2.XMLHTTP") }
		catch (ex)
		{
			try { this.transport = new ActiveXObject("Microsoft.XMLHTTP") }
			catch (ex2) 
			{ 
				log("Can`t create neither Msxml2.XMLHTTP nor Microsoft.XMLHTTP: " + ex.messageText  + ", " + ex2.messageText ) 
			}
		}
	}
	
	if (this.transport)
	{
		var t = this
		this.transport.onreadystatechange = function ()
		{
			t.onreadystatechange()
		}
	}
	else
		log('Can`t create an instatce of the XMLHttpRequest')
}

Programica.Request.paramDelimiter = "&"

Programica.Request.urlEncode = function (data)
{
	if (!data) return ''
	
	// let object deside how to convert itself
	if (data.toUrlEncode)
		return data.toUrlEncode()
	
	switch (data.constructor)
	{
		case Array:
			return data.join(Programica.Request.paramDelimiter)
		
		case Object:
			var arr = []
			for (var i in data)
				if (i != undefined && data[i] != undefined)
					switch (data[i].constructor)
					{
						case Array:
							for (var j = 0, jl = data[i].length; j < jl; j++)
								arr.push(encodeURIComponent(i) + "=" + encodeURIComponent(data[i][j]))
							break
						default:
							arr.push(encodeURIComponent(i) + "=" + encodeURIComponent(data[i]))
							break
					}
			
			return arr.join(Programica.Request.paramDelimiter)
		
		default:
			return encodeURIComponent(data)
	}
}

Programica.Request.prototype =
{
	onLoad: function ()	{},
	
	// default error handler
	onError: function ()
	{
		log(this.errorMessage())
		return true
	},
	
	// this methods may return false to prevent calling onLoad()
	onInformation: function () {},
	onSuccess: function () {},
	onRedirect: function () {},
	
	// and this for onError()
	onClientError: function () {},
	onServerError: function () {},
	
	errorMessage: function () { return "Error while request " + this.lastRequest().uri + ": " + this.status() + " " + this.statusText() },
	
	//——————————————————————————————————————————————————————————————————————————
	// XMLHttpRequest methods wrappers
	
	open: function (method, uri, async, user, password)
	{
		this.lastRequestObject = {method:method,uri:uri,async:async,user:user,password:password}
		return this.transport.open(method, uri, async, user, password)
	},
	
	// transport.send() is wrapped in timer couse of #97
	send: function (data)
	{
		var t = this
		if (this.lastRequestObject.async)
			setTimeout(function () { t.transport.send(data) }, 0)
		else
			t.transport.send(data)
	},
	
	lastRequest: function () { return this.lastRequestObject },
	setRequestHeader: function (header, value) { return this.transport.setRequestHeader(header, value) },
	abort: function () { return this.transport.abort() },
	getAllResponseHeaders: function () { return this.transport.getAllResponseHeaders() },
	getResponseHeader: function (header) { return this.transport.getResponseHeader(header) },
	status: function () { return this.transport.status || 0 }, // 0 for direct file loading from filesystem
	statusText: function () { return this.transport.statusText },
	
	
	//——————————————————————————————————————————————————————————————————————————
	// XMLHttpRequest properties wrappers
	
	readyState: function () { return this.transport.readyState },
	responseText: function () { return this.transport.responseText },
	responseXML: function ()
	{
		var result = this.transport.responseXML
		
		// MSIE
		if(!result.documentElement && this.transport.responseStream)
			result.load(this.transport.responseStream)
		return result
	},
	
	onreadystatechange: function ()
	{
		if (this.readyState() == 4)
		{
			switch (Math.floor(this.status() / 100))
			{
				case 1:
					this.onInformation()
					break
				
				case 0:
				case 2:
					(this.onLoad() !== false) && this.onSuccess()
					break
				
				case 3:
					this.onRedirect()
					break
				
				case 4:
					(this.onError() !== false) && this.onClientError()
					break
				
				case 5:
					(this.onError() !== false) && this.onServerError()
					break
				
				default:
					log("Strange response status: " + this.status())
			}
		}
		
		return false
	}
}


//——————————————————————————————————————————————————————————————————————————————
// shortcuts

self.aPost = function (url, params)
{
	var r = new Programica.Request()
	if (!r) return null
	
	var data = Programica.Request.urlEncode(params)
	
	r.open('POST', url, true)
	r.setRequestHeader("Content-type", "application/x-www-form-urlencoded") // ; charset=utf-8
	r.setRequestHeader("Content-length", data.length)
	r.send(data)
	
	return r
}

self.sPost = function (url, params)
{
	var r = new Programica.Request()
	if (!r) return null
	
	var data = Programica.Request.urlEncode(params)
	
	r.open('POST', url, false)
	r.setRequestHeader("Content-type", "application/x-www-form-urlencoded") // ; charset=utf-8
	r.setRequestHeader("Content-length", data.length)
	r.send(data)
	
	return r
}



self.aGet = function (url, params)
{
	var r = new Programica.Request()
	if (!r) return null
	
	var data = Programica.Request.urlEncode(params)
	var delim = data ? url.indexOf('?') < 0 ? '?' : Programica.Request.paramDelimiter : ''
	
	r.open('GET', url + delim + data, true)
	r.send(null)
	
	return r
}

self.sGet = function (url, params, tail)
{
	var r = new Programica.Request()
	if (!r) return null
	
	var data = tail ? Programica.Request.urlEncode(params) + Programica.Request.paramDelimiter + Programica.Request.urlEncode(tail) : Programica.Request.urlEncode(params)
	var delim = data ? url.indexOf('?') < 0 ? '?' : Programica.Request.paramDelimiter : ''
	
	r.open('GET', url + (data ? delim + data : ''), false)
	r.send(null)
	
	return r
}


self.sPut = function (url, params, tail, data)
{
	var r = new Programica.Request()
	if (!r) return null
	if (!data) return null
	
	var params = tail ? Programica.Request.urlEncode(params) + Programica.Request.paramDelimiter + Programica.Request.urlEncode(tail) : Programica.Request.urlEncode(params)
	var delim = params ? url.indexOf('?') < 0 ? '?' : Programica.Request.paramDelimiter : ''
	
	r.open('POST', url + (params ? delim + params : ''), false)
	r.setRequestHeader("Content-type", "application/x-www-form-urlencoded") // ; charset=utf-8
	r.setRequestHeader("Content-length", data.length)
	r.send(data)
	
	return r
}


self.aHead = function (url, params)
{
	var r = new Programica.Request()
	if (!r) return null
	
	var data = Programica.Request.urlEncode(params)
	var delim = data ? url.indexOf('?') < 0 ? '?' : Programica.Request.paramDelimiter : ''
	
	r.open('HEAD', url + delim + data, true)
	r.send(null)
	
	return r
}

self.sHead = function (url, params)
{
	var r = new Programica.Request()
	if (!r) return false
	
	var data = Programica.Request.urlEncode(params)
	var delim = data ? url.indexOf('?') < 0 ? '?' : Programica.Request.paramDelimiter : ''
	
	r.open('HEAD', url + delim + data, false)
	r.send(null)
	
	return r
}

Programica.Request.transformFragment = function (xml, xsl, node, doc)
{
	doc = doc || document
	
	if (!node || !node.nodeName)
		node = doc.createElement(node)
	
	if (typeof xml.transformNode != 'undefined')
	{
		var markup = xml.transformNode(xsl)
		node.innerHTML = markup
	}
	else if (self.XSLTProcessor)
	{
		var processor = new XSLTProcessor()
		processor.importStylesheet(xsl)
		var fragment = processor.transformToFragment(xml, document)
		node.appendChild(fragment)
	}
	else
		throw new Error('Can`t find way to do XSL transformation')
	
	return node
}
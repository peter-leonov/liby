
// require Programica

// наш «свежий» взгляд на пресловутый аякс


Programica.Request = function (prms)
{
	extend(this,prms)
	
	// в this.transport кладем реальный дескриптор запроса
	
	if (window.XMLHttpRequest) // Mozilla, Safari, ...
	{
		try
		{
			this.transport = new XMLHttpRequest()
			if (this.transport.overrideMimeType) this.transport.overrideMimeType('application/xml')
		}
		catch (E) {}
	}
	else if (window.ActiveXObject) // MSIE
	{
		// microсиво? — а что поделать
		try { this.transport = new ActiveXObject("Msxml2.XMLHTTP") }
		catch (E)
		{
			try 
			{ 
				this.transport = new ActiveXObject("Microsoft.XMLHTTP") 
			}
			catch (E2) 
			{ 
				log("Can`t create neither Msxml2.XMLHTTP nor Microsoft.XMLHTTP: " + E.messageText  + ", " + E2.messageText ) 
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
	else log('Can`t create an instatce of the XHR')
	
	this.lastRequestObject = null
}

Programica.Request.paramDelimiter = "&"

Programica.Request.urlEncode = function (data)
{
	if (!data) return ''
	switch (data.constructor)
	{
		case Array:
			return data.join(Programica.Request.paramDelimiter)
		
		case Object:
			var arr = []
			for (var i in data)
				switch (data[i].constructor)
				{
					case Array:
						for (var j in data[i])
							arr.push(encodeURI(i) + "=" + encodeURI(data[i][j]))
						break
					default:
						arr.push(encodeURI(i) + "=" + encodeURI(data[i]))
						break
				}
			return arr.join(Programica.Request.paramDelimiter)
		
		default:
			return data.toUrlEncode && data.toUrlEncode.constructor == Function ? data.toUrlEncode() : data
	}
}

Programica.Request.prototype =
{
	onLoad:					function ()					{},
	onError: function ()
	{
		var errstr = this.getResponseHeader('X-Server-Error')
		log("Во время запроса (" + this.lastRequest().uri + ") возникла проблема (" + this.status() + "):\n" + errstr)
		return true
	},
	
	// если след. методы возвращают истину, то будет вызвана также и onLoad()
	onInformation:			function () { return true },
	onSuccess:				function () { return true },
	onRedirect:				function () { return true },
	
	// а здесь — onError()
	onClientError:			function () { return true },
	onServerError:			function () { return true },
	
	
	//——————————————————————————————————————————————————————————————————————————
	// обертки методов XMLHttpRequest
	
	open: function (method, uri, async, user, password)
	{
		this.lastRequestObject = {method:method,uri:uri,async:async,user:user,password:password}
		return this.transport.open(method, uri, async, user, password)
	},
	
	/* transport.send() обернута в таймер из-за #97 */
	send:					function (data)
	{
		var t = this
		if (this.lastRequestObject.async)
		{
			setTimeout(function () { t.transport.send(data) }, 0)
		}
		else
			t.transport.send(data)
	},
	
	lastRequest:			function ()					{ return this.lastRequestObject },
	setRequestHeader:		function (header, value)	{ return this.transport.setRequestHeader(header, value) },
	abort:					function ()					{ return this.transport.abort() },
	getAllResponseHeaders:	function ()					{ return this.transport.getAllResponseHeaders() },
	getResponseHeader:		function (header)			{ return this.transport.getResponseHeader(header) },
	status:					function ()					{ return this.transport.status || 0 }, // || 0 для загрузок напрямую из файла без HTTP
	statusText:				function ()					{ return this.transport.statusText },
	
	
	//——————————————————————————————————————————————————————————————————————————
	// обертки свойств XMLHttpRequest
	
	readyState:				function () { return this.transport.readyState },
	responseText:			function () { return this.transport.responseText },
	responseXML:			function ()
	{
		var result = this.transport.responseXML
		
		// MSIE
		if(!result.documentElement && this.transport.responseStream)
		{
			result.load(this.transport.responseStream)
		}
		return result
	},
	
	onreadystatechange: function ()
	{
		switch (this.readyState())
		{
			case 4:
				switch (Math.floor(this.status() / 100))
				{
					case 1:
						this.onInformation()	&& this.onLoad()
						break
					
					case 0:
					case 2:
						this.onSuccess()		&& this.onLoad()
						break
					
					case 3:
						this.onRedirect()		&& this.onLoad()
						break
					
					case 4:
						this.onClientError()	&& this.onError() && this.onLoad()
						break
					
					case 5:
						this.onServerError()	&& this.onError() && this.onLoad()
						break
					
					default:
						log("Strange response status: " + this.status())
				}
		}
		
		return false
	}
}


//——————————————————————————————————————————————————————————————————————————————
// «шоткаты», известные также под псевдонимом «алиасы» :)

function aPost (url, params)
{
	var r = new Programica.Request()
	if (!r) return null
	
	var data = Programica.Request.urlEncode(params)
	
	r.open('POST', url, true)
	r.setRequestHeader("Content-type", "application/x-www-form-urlencoded")
	r.setRequestHeader("Content-length", data.length)
	r.send(data)
	
	return r
}

function sPost (url, params)
{
	var r = new Programica.Request()
	if (!r) return null
	
	var data = Programica.Request.urlEncode(params)
	
	r.open('POST', url, false)
	r.setRequestHeader("Content-type", "application/x-www-form-urlencoded")
	r.setRequestHeader("Content-length", data.length)
	r.send(data)
	
	return r
}



function aGet (url, params)
{
	var r = new Programica.Request()
	if (!r) return null
	
	var data = Programica.Request.urlEncode(params)
	var delim = data ? url.indexOf('?') < 0 ? '?' : Programica.Request.paramDelimiter : ''
	
	r.open('GET', url + delim + data, true)
	r.send(null)
	
	return r
}

function sGet (url, params)
{
	var r = new Programica.Request()
	if (!r) return null
	
	var data = Programica.Request.urlEncode(params)
	var delim = data ? url.indexOf('?') < 0 ? '?' : Programica.Request.paramDelimiter : ''
	
	r.open('GET', url + delim + data, false)
	r.send(null)
	
	return r
}



function aHead (url, params)
{
	var r = new Programica.Request()
	if (!r) return null
	
	var data = Programica.Request.urlEncode(params)
	var delim = data ? url.indexOf('?') < 0 ? '?' : Programica.Request.paramDelimiter : ''
	
	r.open('HEAD', url + delim + data, true)
	r.send(null)
	
	return r
}

function sHead (url, params)
{
	var r = new Programica.Request()
	if (!r) return false
	
	var data = Programica.Request.urlEncode(params)
	var delim = data ? url.indexOf('?') < 0 ? '?' : Programica.Request.paramDelimiter : ''
	
	r.open('HEAD', url + delim + data, false)
	r.send(null)
	
	return r
}


log2("Programica/Request.js loaded")
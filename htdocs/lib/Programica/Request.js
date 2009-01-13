;(function(){

var XHR = XMLHttpRequest

EventDriven.mix(XHR)

var statusEventNames = ['success', 'information', 'success', 'redirect', 'error', 'error']

function onreadystatechange ()
{
	if (this.readyState == 4)
	{
		var status = Math.floor(this.status / 100),
			type = statusEventNames[status]
		
		this.dispatchEvent({type: 'load', request: this})
		
		if (type)
			this.dispatchEvent({type: type, request: this})
		else
			throw new Error("wrong response status: " + this.status)
	}
}

Object.extend(XHR, {UNSENT: 0, OPENED: 1, HEADERS_RECEIVED: 2, LOADING: 3, DONE: 4})

var Me = Programica.Request = {}

Me.post = function (url, params, callback, sync)
{
	var r = new XHR(),
		data = urlEncode(params)
	
	r.open('POST', url, !sync)
	r.setRequestHeader('Content-type', 'application/x-www-form-urlencoded') // ; charset=utf-8
	// r.setRequestHeader('Content-length', data.length)
	r.onreadystatechange = onreadystatechange
	if (callback)
		r.addEventListener('load', callback, false)
	r.send(data)
	
	return r
}

Me.get = function (url, params, callback, sync)
{
	var r = new XHR(),
		data = urlEncode(params),
		delim = data ? url.indexOf('?') < 0 ? '?' : Me.delimiter : ''
	
	r.open('GET', url + delim + data, !sync)
	r.onreadystatechange = onreadystatechange
	if (callback)
		r.addEventListener('load', callback, false)
	r.send(null)
	
	return r
}

var encode = encodeURIComponent

function urlEncode (data)
{
	if (!data)
		return ''
	
	switch (data.constructor)
	{
	case Array:
		return data.join(Me.delimiter)
	
	case Object:
		var arr = []
		for (var i in data)
			if (i != undefined && data[i] != undefined)
				switch (data[i].constructor)
				{
					case Array:
						for (var j = 0, jl = data[i].length; j < jl; j++)
							arr.push(encode(i) + '=' + encode(data[i][j]))
						break
					default:
						arr.push(encode(i) + '=' + encode(data[i]))
						break
				}
		
		return arr.join(Me.delimiter)
	
	default:
		return encode(data)
	}
}


Me.delimiter = '&'
Me.urlEncode = urlEncode


var $ = self.$
if ($)
{
	$.post = Me.post
	$.get = Me.get
}


})();
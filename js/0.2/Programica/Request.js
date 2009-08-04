;(function(){

var Me = Programica.Request = {},
	XHR = XMLHttpRequest,
	statusEventNames = ['success', 'information', 'success', 'redirect', 'error', 'error'],
	urlEncode = UrlEncode.stringify

EventDriven.mix(XHR)

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

Me.onreadystatechange = onreadystatechange

Me.post = function (url, params, callback, sync)
{
	var r = new XHR(),
		data = urlEncode(params)
	
	r.open('POST', url, !sync)
	r.setRequestHeader('Content-type', 'application/x-www-form-urlencoded') // ; charset=utf-8
	// r.setRequestHeader('Content-length', data.length)
	r.onreadystatechange = function () { return onreadystatechange.apply(r, arguments) }
	if (callback)
		r.addEventListener('load', callback, false)
	r.send(data)
	if (sync)
		onreadystatechange.apply(r)
	
	return r
}

Me.get = function (url, params, callback, sync)
{
	var r = new XHR()
	
	if (params)
		url += '?' + urlEncode(params)
	
	r.open('GET', url, !sync)
	r.onreadystatechange = onreadystatechange
	if (callback)
		r.addEventListener('load', callback, false)
	r.send(null)
	if (sync)
		onreadystatechange.apply(r)
	
	return r
}

var $ = self.$
if ($)
{
	$.post = Me.post
	$.get = Me.get
}


})();
;(function(){

var myName = 'Request',
	XHR = XMLHttpRequest, urlEncode = UrlEncode.stringify,
	types = ['success', 'information', 'success', 'redirect', 'error', 'error']

function onreadystatechange ()
{
	if (this.readyState == 4)
		if (this.callback)
			this.callback({type: types[Math.floor(this.status / 100)]})
}

XHR.UNSENT = 0
XHR.OPENED = 1
XHR.HEADERS_RECEIVED = 2
XHR.LOADING = 3
XHR.DONE = 4

var Me = self[myName] =
{
	onreadystatechange: onreadystatechange,
	charset: 'utf-8',
	post: function (url, params, callback, sync)
	{
		var r = new XHR()
		
		r.open('POST', url, !sync)
		r.setRequestHeader('Content-type', 'application/x-www-form-urlencoded; charset=' + this.charset)
		r.onreadystatechange = onreadystatechange
		if (callback)
			r.callback = callback
		r.send(urlEncode(params))
		if (sync)
			onreadystatechange.apply(r)
		
		return r
	},
	
	get: function (url, params, callback, sync)
	{
		var r = new XHR()
		
		if (params)
			url += (url.indexOf('?') ? UrlEncode.paramDelimiter : '?') + urlEncode(params)
		
		r.open('GET', url, !sync)
		r.onreadystatechange = onreadystatechange
		if (callback)
			r.callback = callback
		r.send(null)
		if (sync)
			onreadystatechange.apply(r)
		
		return r
	}
}


})();
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
		if (!sync)
			r.onreadystatechange = function () { onreadystatechange.call(r) } // wrapped for FF 2.0
		if (callback)
			r.callback = callback
		r.send(typeof params == 'string' ? params : urlEncode(params))
		if (sync)
			onreadystatechange.call(r)
		
		return r
	},
	
	get: function (url, params, callback, sync)
	{
		var r = new XHR()
		
		if (params)
			url += (url.indexOf('?') != -1 ? UrlEncode.paramDelimiter : '?') + urlEncode(params)
		
		r.open('GET', url, !sync)
		if (!sync)
			r.onreadystatechange = function () { onreadystatechange.call(r) } // wrapped for FF 2.0
		if (callback)
			r.callback = callback
		r.send(null)
		if (sync)
			onreadystatechange.call(r) // called for FF 3.5, 3.6
		
		return r
	}
}


})();
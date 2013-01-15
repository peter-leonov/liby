;(function(){

var Request =
{
	charset: 'utf-8',
	post: function (url, data, callback, sync)
	{
		var r = new XMLHttpRequest()
		
		r.open('POST', url, !sync)
		r.setRequestHeader('Content-type', 'application/x-www-form-urlencoded; charset=' + this.charset)
		if (!sync)
			r.onreadystatechange = function () { onreadystatechange.call(r) } // wrapped for FF 2.0
		if (callback)
			r.callback = callback
		r.send(data)
		if (sync)
			onreadystatechange.call(r)
		
		return r
	},
	
	get: function (url, callback)
	{
		return Request.open('GET', url, null, callback)
	},
	
	open: function (method, url, data, callback)
	{
		var r = new XMLHttpRequest()
		
		r.open(method, url, true)
		
		r.onreadystatechange = function onreadystatechange ()
		{
			if (r.readyState != 4)
				return
			
			callback(r)
		}
		
		// postpone sending a request giving caller a chance to configure the request
		window.setTimeout(function () { r.send(data) }, 0)
		
		return r
	}
}

self.Request = Request

})();

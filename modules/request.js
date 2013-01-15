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
		var r = new XMLHttpRequest()
		
		r.open('GET', url, true)
		
		r.onreadystatechange = function onreadystatechange ()
		{
			if (r.readyState != 4)
				return
			
			callback(r)
		}
		
		// postpone sending a request giving caller a chance to configure the request
		window.setTimeout(function () { r.send() }, 0)
		
		return r
	}
}

self.Request = Request

})();

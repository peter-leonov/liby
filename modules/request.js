;(function(){

var Request =
{
	get: function (url, callback)
	{
		return Request.open('GET', url, null, callback)
	},
	
	post: function (url, data, callback)
	{
		return Request.open('POST', url, data, callback)
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

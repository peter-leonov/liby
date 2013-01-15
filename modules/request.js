;(function(){

var Request =
{
	get: function (uri, callback)
	{
		return Request.open('GET', uri, null, callback)
	},
	
	head: function (uri, callback)
	{
		return Request.open('HEAD', uri, null, callback)
	},
	
	post: function (uri, data, callback)
	{
		return Request.open('POST', uri, data, callback)
	},
	
	open: function (method, uri, data, callback)
	{
		var r = new XMLHttpRequest()
		
		r.open(method, uri, true)
		
		r.onreadystatechange = function onreadystatechange ()
		{
			if (r.readyState != 4)
				return
			
			callback(r.responseText, r.status, r)
		}
		
		// postpone sending a request giving caller a chance to configure the request
		window.setTimeout(function () { r.send(data) }, 0)
		
		return r
	}
}

self.Request = Request

})();

;(function(){

var types = ['success', 'information', 'success', 'redirect', 'error', 'error']

function onreadystatechange (r, callback)
{
	if (r.readyState == 4)
	{
		r.statusType = types[Math.floor(r.status / 100)]
		if (callback)
			callback(r.responseText, r)
	}
}

var Request =
{
	onreadystatechange: onreadystatechange,
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
		r.onreadystatechange = function () { onreadystatechange(r, callback) }
		r.send(null)
		
		return r
	}
}

self.Request = Request

})();

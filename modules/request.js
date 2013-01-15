;(function(){

var myName = 'Request',
	types = ['success', 'information', 'success', 'redirect', 'error', 'error']

function onreadystatechange ()
{
	if (this.readyState == 4)
	{
		this.statusType = types[Math.floor(this.status / 100)]
		var callback = this.callback
		if (callback)
			callback(this.responseText, this)
	}
}

var Me = self[myName] =
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
	
	get: function (url, callback, sync)
	{
		var r = new XMLHttpRequest()
		
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
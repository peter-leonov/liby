// RPC
;(function(){

var myName = 'RPC',
	Me = self[myName] = Class(myName),
	XHR = XMLHttpRequest,
	onreadystatechange = Programica.Request.onreadystatechange

Me.prototype.extend
({
	initialize: function (url)
	{
		this.url = url
	},
	
	call: function (method, params, callback, sync)
	{
		var r = new XHR()
		
		r.open('POST', this.url, !sync)
		r.setRequestHeader('Content-type', 'application/x-json') // ; charset=utf-8
		// r.setRequestHeader('Content-length', data.length)
		r.onreadystatechange = onreadystatechange
		if (callback)
			r.addEventListener('load', function (e) { callback.apply(this, [JSON.parse(e.request.responseText)]) }, false)
		r.send(JSON.stringify({jsonrpc:"2.0", id:0, params: params}))
	}
})

})();

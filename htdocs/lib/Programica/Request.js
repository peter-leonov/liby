;(function(){


// XMLHttpRequest.mixIn(EventDriven)
// if (this.readyState == 4)
// {
// 	this.responseText = this.transport.responseText
// 	
// 	switch (Math.floor(this.status() / 100))
// 	{
// 		case 1:
// 			this.onInformation()
// 			break
// 		
// 		case 0:
// 		case 2:
// 			(this.onLoad() !== false) && this.onSuccess()
// 			break
// 		
// 		case 3:
// 			this.onRedirect()
// 			break
// 		
// 		case 4:
// 			(this.onError() !== false) && this.onClientError()
// 			break
// 		
// 		case 5:
// 			(this.onError() !== false) && this.onServerError()
// 			break
// 		
// 		default:
// 			log("Strange response status: " + this.status())
// 	}
// }




var Me = Programica.Request = {}

function urlEncode (data)
{
	if (!data) return ''
	
	switch (data.constructor)
	{
		case Array:
			return data.join(Me.delimiter)
		
		case Object:
			var arr = []
			for (var i in data)
				if (i != undefined && data[i] != undefined)
					switch (data[i].constructor)
					{
						case Array:
							for (var j = 0, jl = data[i].length; j < jl; j++)
								arr.push(encodeURIComponent(i) + '=' + encodeURIComponent(data[i][j]))
							break
						default:
							arr.push(encodeURIComponent(i) + '=' + encodeURIComponent(data[i]))
							break
					}
			
			return arr.join(Me.delimiter)
		
		default:
			return encodeURIComponent(data)
	}
}

Me.post = function (url, params, callback, sync)
{
	var r = new XMLHttpRequest()
	if (!r) return null
	
	var data = urlEncode(params)
	
	r.open('POST', url, !sync)
	r.setRequestHeader('Content-type', 'application/x-www-form-urlencoded') // ; charset=utf-8
	// r.setRequestHeader('Content-length', data.length)
	r.send(data)
	
	return r
}



Me.get = function (url, params, callback, sync)
{
	var r = new XMLHttpRequest()
	if (!r) return null
	
	var data = urlEncode(params)
	var delim = data ? url.indexOf('?') < 0 ? '?' : Me.delimiter : ''
	
	r.open('GET', url + delim + data, !sync)
	r.send(null)
	
	return r
}


Me.delimiter = '&'
Me.urlEncode =  urlEncode 


if (self.$)
{
	self.$.post = Me.post
	self.$.get  = Me.get
}


})();
;(function(){

var Me =
{
	decode: decodeURIComponent,
	encode: encodeURIComponent,
	paramDelimiter: '&',
	
	parse: function (string, forceArray)
	{
		var decode = this.decode
		var res = {}
		
		var parts = String(string).split(this.paramDelimiter)
		for (var i = 0; i < parts.length; i++)
		{
			var pair = parts[i].split('='),
				k = pair[0],
				v = pair[1]
			
			if (v === undefined)
			{
				if (k == '')
					continue
			}
			else
				v = decode(v)
			
			k = decode(k)
			
			if (forceArray)
			{
				if (res[k])
					res[k].push(v)
				else
					res[k] = [v]
			}
			else
			{
				var a = res[k]
				if (a)
				{
					if (typeof res[k] == 'object')
						res[k].push(v)
					else
						res[k] = [res[k], v]
				}
				else
					res[k] = v
			}
		}
		
		return res
	},
	
	stringify: function (data)
	{
		var encode = this.encode,
			pairs = []
		
		for (var k in data)
		{
			var v = data[k]
			k = encode(k)
			if (v == undefined || v == null)
			{
				pairs.push(k + "=" + v)
			}
			else
			{
				switch (v.constructor)
				{
					case Array:
						for (var j = 0, jl = v.length; j < jl; j++)
							pairs.push(k + "=" + encode(v[j]))
						break
					case Object:
						pairs.push(k + "=" + encode('[object]'))
						break
					default:
						pairs.push(k + "=" + encode(v))
						break
				}
			}
		}
		
		return pairs.join(this.paramDelimiter)
	}
}

Me.className = 'UrlEncode'
self[Me.className] = Me

})();
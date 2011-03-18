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
				if (res[k])
				{
					if (typeof res[k] == 'array')
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
		var pd = this.paramDelimiter,
			encode = this.encode
		
		if (!data)
			return ''
		
		if (typeof data.toUrlEncode == 'function')
			return data.toUrlEncode()
		
		switch (data.constructor)
		{
			case Array:
				var arr = []
				for (var j = 0, jl = data.length; j < jl; j++)
					arr.push(encode(data[j]))
				return arr.join(pd)
			
			case Object:
				var arr = []
				for (var i in data)
					if (i !== undefined && i != '')
					{
						var v = data[i]
						var enci = encode(i)
						if (v !== undefined && v !== null)
							switch (v.constructor)
							{
								case Array:
									for (var j = 0, jl = v.length; j < jl; j++)
										arr.push(enci + "=" + encode(v[j]))
									break
								case Object:
									arr.push(enci + "=" + encode('[object]'))
									break
								default:
									arr.push(enci + "=" + encode(v))
									break
							}
					}
				return arr.join(pd)
			
			default:
				return encode(data)
		}
	}
}

Me.className = 'UrlEncode'
self[Me.className] = Me

})();
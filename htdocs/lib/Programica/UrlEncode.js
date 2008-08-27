var UrlEncode = 
{
	paramDelimiter: '&',
	
	parse: function (string, forceArray)
	{
		string = string.substr(1, string.length-1)
	
		var res = {}
	
		var parts = string.split(/[;&]/)
		for (var i=0; i < parts.length; i++)
		{
			var a = parts[i].split('=')
			var name = a[0]
			a[0] = ''
			var val = decodeURIComponent(a.join(''))
		
			if (forceArray)
			{
				if (res[name])
					res[name].push(val)
				else
					res[name] = [val]
			}
			else
			{
				if (res[name])
				{
					if (typeof res[name] == 'array')
						res[name].push(val)
					else
						res[name] = [res[name], val]
				}
				else
					res[name] = val
			}
		}
	
		return res
	},
	
	stringify: function (data)
	{
		var enc = encodeURIComponent,
			pd = this.paramDelimiter
		
		if (!data)
			return ''
		
		if (typeof data.toUrlEncode == 'function')
			return data.toUrlEncode()
		
		switch (data.constructor)
		{
			case Array:
				return data.join(pd)
			
			case Object:
				var arr = []
				for (var i in data)
					if (i !== undefined && i != '')
					{
						var val = data[i]
						var enci = enc(i)
						if (val !== undefined && val !== null)
							switch (val.constructor)
							{
								case Array:
									for (var j = 0, jl = val.length; j < jl; j++)
										arr.push(enci + "=" + enc(val[j]))
									break
								default:
									arr.push(enci + "=" + enc(val))
									break
							}
					}
				return arr.join(pd)
			
			default:
				return enc(data)
		}
	}
}
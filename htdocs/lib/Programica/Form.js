// example: $('form').toHash()
HTMLFormElement.prototype.toHash = function (forse_array) { return Programica.Form.form2hash(this, forse_array) }
HTMLFormElement.prototype.fromHash = function (hash) { return Programica.Form.hash2form(hash, this) }

Programica.Form = {}

// Преобразование данных формы в хеш
Programica.Form =
{
	form2hash: function (f, forse_array)
	{
		var node, val, nn, hash = {}
		
		for (var i = 0; i < f.length; i++)
		{
			node = f.elements[i]
			nn = node.name
			
			// skip nodes with exect empty names
			if (nn === '')
				continue
			
			val = null
			switch (node.type)
			{
				case 'checkbox':
					val = node.checked ? node.value : null
					break
				
				case 'radio':
					val = node.checked ? node.value : null
					break
				
				case 'select-one':
					val = node.options[node.selectedIndex].value
					break
				
				case 'submit':
					break
				
				default:
					val = node.value
			}
			
			if (val != null)
			{
				if	(hash[nn] == null)
					hash[nn] = forse_array ? [val] : val
				else if (hash[nn].constructor == Array)
					hash[nn].push(val)
				else
					hash[nn] = [hash[nn], val]
			}
			else if (forse_array && !hash[nn])
				hash[nn] = []
		}
		
		return hash;
	},
	
	indexFormHash: function (h)
	{
		var res = {}
		for (var k in h)
		{
			var v = h[k]
			var ndx = res[k] = {}
			if (v === undefined)
				ndx
			if (v.constructor == Array)
				for (var i = 0; i < v.length; i++)
					ndx[v[i]] = ndx[v[i]] ? ndx[v[i]] + 1 : 1
			else if (v.constructor == String)
				ndx[v] = 1
			else
				throw new Error('Can`t proceed key of constructor "' + v.constructor + '"')
		}
		log(res)
		return res
	},
	
	hash2form1: function (h, f)
	{
		h = this.indexFormHash(h)
		for (var i = 0; i < f.length; i++)
		{
			var node = f.elements[i]
			var nn = node.name
			
			if (h[nn])
				switch (node.type)
				{
					case 'checkbox':
					case 'radio':
						if (h[nn][node.value])
							h[nn][node.value]--, node.checked =  'checked'
						break
				
					case 'select-one':
						val = node.options[node.selectedIndex].value
						break
					
					case 'submit':
						break
					
					default:
						for (var k in h[nn])
							if (h[nn][k])
							{
								h[nn][k]--
								node.value = k
								break
							}
				}
		}
	},
	
	forceArrayFormHash: function (h)
	{
		var res = {}
		for (var k in h)
		{
			var v = h[k]
			if (typeof v === 'undefined')
				throw new Error('Can`t proceed undefined value for key "' + k + '"')
			else if (typeof v == 'string')
				res[k] = [String(v)]
			else if (v instanceof Array)
				res[k] = v.slice()
			else
				throw new Error('Can`t proceed key of constructor "' + v.constructor + '"')
		}
		log(res)
		return res
	},
	
	hash2form: function (h, f)
	{
		h = this.forceArrayFormHash(h)
		for (var i = 0; i < f.length; i++)
		{
			var node = f.elements[i]
			var v
			
			if (v = h[node.name])
				switch (node.type)
				{
					case 'checkbox':
					case 'radio':
						if (v[0] == node.value)
							v.shift(), node.checked = 'checked'
						break
					
					case 'select-one':
						for (var j = 0; j < node.options.length; j++)
							if (v[0] == node.options[j].value)
							{
								node.selectedIndex = j
								v.shift()
								break
							}
						break
					
					case 'text':
					case 'textarea':
						node.value = v.shift()
						break
				}
		}
	}
}

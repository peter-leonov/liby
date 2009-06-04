;(function(){

var Me = Programica.Form =
{
	toHash: function (form, fa)
	{
		var hash = {}, many = {}, push = ([]).push, els = form.elements
		
		for (var i = 0, l = els.length; i < l; i++)
		{
			var node = els[i], name = node.name, val
			
			// skip nodes with the exact empty names
			if (name === '')
				continue
			
			switch (node.type)
			{
				case 'checkbox':
				case 'radio':
					if (node.checked)
						val = [node.value]
					else
						continue
					break
				
				case 'select-one':
					if (node.selectedIndex < 0)
						continue
					val = [node.options[node.selectedIndex].value]
					break
				
				case 'select-multiple':
					if (node.selectedIndex < 0)
						continue
					var options = node.options
					val = []
					for (var j = 0, jl = options.length; j < jl; j++)
					{
						var option = options[j]
						if (option.selected)
							val.push(option.value)
					}
					break
				
				default:
					val = [node.value]
			}
			
			if (fa)
			{
				if (name in hash)
					push.apply(hash[name], val)
				else
					hash[name] = val
			}
			else
			{
				if (name in hash)
				{
					var v = hash[name]
					if (many[name])
						push.apply(v, val)
					else
					{
						hash[name] = val
						val.unshift(v)
						many[name] = true
					}
				}
				else
					hash[name] = val.length > 1 ? val : val[0]
			}
		}
		
		// if (!fa)
		// 	for (var k in hash)
		// 	{
		// 		val = hash[k]
		// 		if (val.length == 1)
		// 			hash[k] = val[0]
		// 	}
		
		return hash;
	}
}

})();
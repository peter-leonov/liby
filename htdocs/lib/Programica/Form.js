// example: $('form').toHash()
HTMLFormElement.prototype.toHash = function (fa) { return Programica.Form.form2hash(this, fa) }

Programica.Form = {}

// Преобразование данных формы в хеш
Programica.Form =
{
	form2hash: function (f, fa)
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
					hash[nn] = fa ? [val] : val
				else if (hash[nn].constructor == Array)
					hash[nn].push(val)
				else
					hash[nn] = [hash[nn], val]
			}
			else if (fa && !hash[nn])
				hash[nn] = []
		}
		
		return hash;
	}
}

log2("Programica/Form.js loaded")
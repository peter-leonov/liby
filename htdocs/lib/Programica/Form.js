// example: $('form').data()
HTMLFormElement.prototype.data = function () { return Programica.Form.form2hash(this) }

Programica.Form = {}

// Преобразование данных формы в хеш
Programica.Form =
{
	form2hash: function (f)
	{
		var elem
		var hash = {}
		
		for (var i = 0; i < f.length; i++)
		{
			elem = f.elements[i]
			var val = null
			switch (elem.type)
			{
				case "checkbox":
					val = elem.checked ? elem.value : null
					break
				
				case "radio":
					val = elem.checked ? elem.value : null
					break
				
				case "select-one":
					val = elem.options[elem.selectedIndex].value
					break
				
				case "submit":
					break
				
				default:
					val = elem.value
			}
			
			if (val != null)
				if	(hash[elem.name] == null)
					hash[elem.name] = val
				else if (hash[elem.name].constructor == Array)
					hash[elem.name].push(val)
				else
					hash[elem.name] = [hash[elem.name], val]
		}
		
		return hash;
	}
}

log2("Programica/Form.js loaded")
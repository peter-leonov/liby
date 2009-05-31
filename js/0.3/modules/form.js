;(function(){

var Me = Programica.Form =
{
	form2hash: function (form, fa)
	{
		var hash = {}, isArray = {}, els = form.elements
		
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
						val = node.value
					else
						continue
					break
				
				case 'select-one':
					val = node.options[node.selectedIndex].value
					break
				
				default:
					val = node.value
			}
			
			if (fa)
			{
				if (name in hash)
					hash[name].push(val)
				else
					hash[name] = [val]
			}
			else
			{
				if (name in hash)
				{
					var v = hash[name]
					if (isArray[name])
						v.push(val)
					else
					{
						isArray[name] = true
						hash[name] = [v, val]
					}
				}
				else
					hash[name] = val
			}
		}
		
		return hash;
	}
}

// example: $('form').toHash()
HTMLFormElement.prototype.toHash = function (fa) { return Me.form2hash(this, fa) }

})();
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
	
	//// Тестовая функция заполнения формы
	//function fillTest(testForm, hash)
	//{
	//	var f = document.getElementById(testForm);
	//	var elem;
	//
	//	for ( var i = 0; i < f.elements.length; i++ )
	//	{
	//		elem = f.elements[i];
	//		switch (elem.type)
	//		{
	//			case "checkbox"	  :	elem.checked = hash[elem.name]; break;
	//			case "radio"      : elem.checked = hash[elem.name]; break;
	//			case "select-one" :	elem.selectedIndex = hash[elem.name]; break;
	//			case "submit"     : break;
	//			default           : elem.value = hash[elem.name];
	//		}
	//	}
	//}
	
	
	//function checkHash(inputHash, cHash)
	//{
	//	var result = {};
	//	var str;
	//	
	//	for (var i in inputHash)
	//	{
	//		//alert(inputHash[i]);
	//		if (!cHash[i]) continue
	//		
	//		if (cHash[i].constructor == RegExp)
	//		{
	//			if (cHash[i].test(inputHash[i]) >= 0)
	//				result[i] = true;
	//			else
	//				result[i] = false;
	//		}
	//		else
	//		{
	//			if (cHash[i] == inputHash[i])
	//				result[i] = true;
	//			else
	//				result[i] = false;
	//		}
	//		
	//		//alert(inputHash[i] + " : " + result[i]);
	//	}
	//	//alert(result.toString());
	//
	//	var hz;
	//	for (var z in result)
	//		hz += z + " : " + result[z] + "\n";
	//	alert(hz);
	//	
	//
	//
	//	return result;
	//}
	
	//function resDrawer(cHash, type)
	//{
	//	var id = {};
	//	var a = 0;
	//	var error = false;
	//	//switch (type)
	//	//{
	//	//	case "style"  :	alert("style"); break; // меняем стиль объекта
	//	//	case "baloon" :	alert("baloon"); break; // создаем всплывающее сообщение
	//	//	default		  :	alert("default"); break; // дефолтные действия
	//	//}
	//	if(type == "baloon")
	//	{
	//		for(var i in cHash)
	//		{
	//			a++;
	//			if(!cHash[i])
	//			{
	//				id[a] = document.getElementById('baloon' + a);
	//				id[a].style.display = 'block';
	//				error = true;
	//			}
	//			else
	//			{
	//				id[a] = document.getElementById('baloon' + a);
	//				id[a].style.display = 'none';
	//			}
	//		}	
	//	}
	//	
	//	if(type == "style")
	//	{
	//		// действия при изменении стилей
	//		for(var i in cHash)
	//		{
	//			//if(!cHash[i])
	//			alert(document.forms[0]);
	//			//document.forms[0].elements[i].className = "error";
	//			//alert(document.forms[0].elements[i]);
	//		}
	//	}
	//	
	//	if (error) return false;
	//	
	//	return true;
	//}
	
	//var rulesArr =
	//[
	//	{ // rule1
	//		name: "input1",
	//		test: function() { return /\d/.test(document.getElementById('input1').value) },
	//		ok: function() { document.getElementById("baloon1").style.display = 'none' },
	//		error: function() { document.getElementById("baloon1").style.display = 'block' }
	//	},
	//	
	//	{ // rule2
	//		name: "input2",
	//		test: /\S/,
	//		ok: function() { alert("input2 OK") },
	//		error: function() { alert("input2 ERROR!") }
	//	}
	//]
}

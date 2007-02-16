
// require Programica

var hashRightTest =
{
	input1: "input1 value",
	input2: "input2 value",
	textArea: "textArea value",
	checkBox1: "chk1 val",
	checkBox2: "chk2 val",
	radio: "r2",
	select: "select2"
};

var hashRight =
{
	input1: "input1 value",
	input2: "input2 value",
	textArea: "textArea value",
	checkBox1: true,
	checkBox2: true,
	radio: "r2",
	select: 2
};

var hashWrong =
{
	input1: "",
	input2: "",
	textArea: "",
	checkBox1: false,
	checkBox2: false,
	radio: false,
	select: 0
};


// Тестовая функция заполнения формы
function fillTest(testForm, hash)
{
	var f = document.getElementById(testForm);
	var elem;

	for ( var i = 0; i < f.elements.length; i++ )
	{
		elem = f.elements[i];
		switch (elem.type)
		{
			case "checkbox"	  :	elem.checked = hash[elem.name]; break;
			case "radio"      : elem.checked = hash[elem.name]; break;
			case "select-one" :	elem.selectedIndex = hash[elem.name]; break;
			case "submit"     : break;
			default           : elem.value = hash[elem.name];
		}
	}
}

// Преобразование данных формы в хеш
function form2hash(f)
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

function checkHash(inputHash, cHash)
{
	var result = {};
	var str;
	
	for (var i in inputHash)
	{
		//alert(inputHash[i]);
		if (!cHash[i]) continue
		
		if (cHash[i].constructor == RegExp)
		{
			if (cHash[i].test(inputHash[i]) >= 0)
				result[i] = true;
			else
				result[i] = false;
		}
		else
		{
			if (cHash[i] == inputHash[i])
				result[i] = true;
			else
				result[i] = false;
		}
		//alert(result[i]);
	}
	//alert(result.toString());
	return result;
}

function resDrawer(cHash, type)
{
	var id = {};
	var a = 0;
	var error = false;
	//switch (type)
	//{
	//	case "style"  :	alert("style"); break; // меняем стиль объекта
	//	case "baloon" :	alert("baloon"); break; // создаем всплывающее сообщение
	//	default		  :	alert("default"); break; // дефолтные действия
	//}
	if(type == "baloon")
	{
		for(var i in cHash)
		{
			a++;
			if(!cHash[i])
			{
				id[a] = document.getElementById('baloon' + a);
				id[a].style.display = 'block';
				error = true;
			}
			else
			{
				id[a] = document.getElementById('baloon' + a);
				id[a].style.display = 'none';
			}
		}	
	}
	
	if(type == "style")
	{
		// действия при изменении стилей
		for(var i in cHash)
		{
			//if(!cHash[i])
			alert(document.forms[0]);
			//document.forms[0].elements[i].className = "error";
			//alert(document.forms[0].elements[i]);
		}
	}
	
	if (error) return false;
}

function main(form, maskHash, mType)
{
	var formH = form2hash(form);
	var check = checkHash(formH, maskHash);
	//alert(formH);
	//alert(maskHash);
	//alert(check);
	
	return resDrawer(check, mType);
	//alert(form2hash(form));
}


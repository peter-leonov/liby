
// DOM для всех

// took from http://muffinresearch.co.uk/archives/2006/04/29/getelementsbyclassname-deluxe-edition/
Programica.DOM.getElementsByClassName = function (strClass, strTag)
{
	strTag = strTag || "*";
	strClass = strClass || "*";
	
	var objColl = this.getElementsByTagName(strTag);
	if (!objColl.length && strTag == "*" && this.all) objColl = this.all;
	
	if (strClass == "*") return objColl
	
	var arr = new Array();
	var delim = strClass.indexOf('|') != -1  ? '|' : ' ';
	var arrClass = strClass.split(delim);
	
	for (var i = 0, ilen = objColl.length; i < ilen; i++)
	{
		if (!objColl[i].className || !objColl[i].className.split)
			continue
		
		var arrObjClass = objColl[i].className.split(' ');
		if (delim == ' ' && arrClass.length > arrObjClass.length) continue;
		
		var c = 0;
		comparisonLoop:
		for (var k = 0, klen = arrObjClass.length; k < klen; k++)
		{
			for (var m = 0, mlen = arrClass.length; m < mlen; m++)
			{
				if (arrClass[m] == arrObjClass[k]) c++;
				if ( (delim == '|' && c == 1) || (delim == ' ' && c == mlen) )
				{
					arr.push(objColl[i]);
					break comparisonLoop;
				}
			}
		}
	}
	return arr;
}

Programica.DOM.getParentsByClassName = function (strClass, strTag)
{
	if (!strClass) return []
	strTag = strTag || "*";
	
	var objColl = []
	
	var node = this
	while ((node = node.parentNode) && node.nodeType != 9)
		if (strTag == '*' || node.nodeName == strTag)
			objColl.push(node)
	
	var arr = new Array();
	var delim = strClass.indexOf('|') != -1  ? '|' : ' ';
	var arrClass = strClass.split(delim);
	
	for (var i = 0, ilen = objColl.length; i < ilen; i++)
	{
		var arrObjClass = objColl[i].className.split(' ');
		if (delim == ' ' && arrClass.length > arrObjClass.length) continue;
		
		var c = 0;
		comparisonLoop:
		for (var k = 0, klen = arrObjClass.length; k < klen; k++)
		{
			for (var m = 0, mlen = arrClass.length; m < mlen; m++)
			{
				if (arrClass[m] == arrObjClass[k]) c++;
				if ( (delim == '|' && c == 1) || (delim == ' ' && c == mlen) )
				{
					arr.push(objColl[i]);
					break comparisonLoop;
				}
			}
		}
	}
	return arr;
}


Programica.DOM.addClassName = function (cn)
{
	this.remClassName(cn)
	this.className += ' ' + cn
	return cn
}

Programica.DOM.remClassName = function (cn)
{
	this.className = this.className.replace(new RegExp('\\s*\\b' + cn + '\\b\\s*', "g"), " ").replace(/^\s+|\s+$/g, "")
	return cn
}

Programica.DOM.hasClassName = function (cn)
{
	return (this.className == cn || this.className.match(new RegExp("(^|\\s)" + cn + "(\\s|$)")))
}

Programica.DOM.disable = function ()
{
	this.setAttribute('disabled', true)
	this.addClassName('disabled')
}

Programica.DOM.enable = function ()
{
	this.removeAttribute('disabled')
	this.remClassName('disabled')
}

Programica.DOM.hide = function (t)
{
	if (t)
	{
		if (this.animate)
		{
			var ani = this.animate('linearTween', {opacity:[0]}, t)
			ani.addEventListener
			(
				'complete',
				function ()
				{
					this.obj.style.display = 'none'
				}
			)
			ani.start()
			return ani
		}
		else
			setTimeout(function () { this.style.display = 'none' }, t * 1000)
	}
	else
		this.style.display = 'none'
	
	return true
}

Programica.DOM.show = function (t)
{
	if (t)
	{
		if (this.animate)
		{
			if (!this.visible()) this.style.opacity = 0
			this.style.display = 'block'
			this.style.visibility = 'visible'
			return this.animate('linearTween', {opacity:1}, t).start()
		}
		else
			setTimeout(function () { this.style.display = 'block'; this.style.opacity = 1 }, t * 1000)
	}
	else
	{
		this.style.visibility = 'visible'
		this.style.display = 'block'
	}
	
	return true
}

Programica.DOM.visible = function ()
{
	//log(this.style.opacity + ': ' + parseFloat(this.style.opacity))
	return this.offsetWidth && this.style.display != 'none' && parseFloat(this.style.opacity) != 0
}

Programica.DOM.$$ = function (cn)
{
	return this.getElementsByClassName(cn)
}

Programica.DOM.$$$ = function (cn)
{
	return this.getElementsByTagName(cn)
}

Programica.DOM.getComputedStyle = function (prop)
{
	return document.defaultView.getComputedStyle(this, null).getPropertyValue(prop)
}


{
	var interfaces = [Element]
	
	for (var ii = 0; ii < interfaces.length; ii++)
		for (var m in Programica.DOM)
			interfaces[ii].prototype[m] = Programica.DOM[m]
}

if (!document.getElementsByClassName)
	document.getElementsByClassName = Programica.DOM.getElementsByClassName


log2("Programica/DOM.js loaded")
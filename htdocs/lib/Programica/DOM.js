
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
	this.className = this.className.replace(new RegExp(' +' + cn, "g"), "")
	return cn
}

Programica.DOM.disable = function ()
{
	this.setAttribute('disabled', true)
}

Programica.DOM.enable = function ()
{
	this.removeAttribute('disabled')
}



if (!XULElement.prototype.getElementsByClassName)
	XULElement.prototype.getElementsByClassName = Programica.DOM.getElementsByClassName

if (!HTMLElement.prototype.getElementsByClassName)
	HTMLElement.prototype.getElementsByClassName = Programica.DOM.getElementsByClassName

if (!document.getElementsByClassName)
	document.getElementsByClassName = Programica.DOM.getElementsByClassName


if (!HTMLElement.prototype.getParentsByClassName)
	HTMLElement.prototype.getParentsByClassName = Programica.DOM.getParentsByClassName





if (!HTMLElement.prototype.addClassName)
	HTMLElement.prototype.addClassName = Programica.DOM.addClassName

if (!HTMLElement.prototype.remClassName)
	HTMLElement.prototype.remClassName = Programica.DOM.remClassName


if (!HTMLElement.prototype.disable)
	HTMLElement.prototype.disable = Programica.DOM.disable

if (!HTMLElement.prototype.enable)
	HTMLElement.prototype.enable = Programica.DOM.enable

if (!XULElement.prototype.disable)
	XULElement.prototype.disable = Programica.DOM.disable

if (!XULElement.prototype.enable)
	XULElement.prototype.enable = Programica.DOM.enable

log2("Programica/DOM.js loaded")
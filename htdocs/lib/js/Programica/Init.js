
// заранее объявляем «пространства имен»

if (!window.Programica) var Programica = {}
if (!window.Programica.Abstract) Programica.Abstract = {}
if (!window.Programica.DOM) Programica.DOM = {}

//——————————————————————————————————————————————————————————————————————————————
// Логи

Programica.debugLevel = 1

log.elem = document.createElement("pre")
log.elem.id = "log-elem"

function log (str)
{
	if (Programica.debugLevel <= 0) return false
	if (console && console.log) return console.log(str)
	
	log.elem.innerHTML += str + "\n"
	
	if (document.body)
		document.body.appendChild(log.elem)
	
	return str
}

function log3 () { if (Programica.debugLevel >= 3) log.apply(this, arguments) }
function log2 () { if (Programica.debugLevel >= 2) log.apply(this, arguments) }


if (!window.HTMLElement) window.HTMLElement = {}
if (!HTMLElement.prototype) HTMLElement.prototype = window["[[DOMElement.prototype]]"] || {}


//——————————————————————————————————————————————————————————————————————————————
// DOM для всех

// took from http://muffinresearch.co.uk/archives/2006/04/29/getelementsbyclassname-deluxe-edition/
Programica.DOM.getElementsByClassName = function (strClass, strTag)
{
	if (!strClass) return []
	strTag = strTag || "*";
	
	var objColl = this.getElementsByTagName(strTag);
	if (!objColl.length && strTag == "*" && this.all) objColl = this.all;
	
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

Programica.DOM.getElementsByName = function (strName, strTag)
{
	strTag = strTag || "*";
	
	var objColl = this.getElementsByTagName(strTag);
	if (!objColl.length && strTag == "*" && this.all) objColl = this.all;
	
	var arr = new Array();
	var delim = strName.indexOf('|') != -1  ? '|' : ' ';
	var arrName = strName.split(delim);
	
	for (var i = 0, ilen = objColl.length; i < ilen; i++)
	{
		var objName = objColl[i].getAttribute('name');
		if (!objName) continue;
		
		var c = 0;
		comparisonLoop:
		for (var m = 0, mlen = arrName.length; m < mlen; m++)
		{
			if (arrName[m] == objName) c++;
			if (( delim == '|' && c == 1) || (delim == ' ' && c == arrName.length))
			{
				arr.push(objColl[i]);
				break comparisonLoop;
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



if (!HTMLElement.prototype.getElementsByClassName)
	HTMLElement.prototype.getElementsByClassName = Programica.DOM.getElementsByClassName

if (!document.getElementsByClassName)
	document.getElementsByClassName = Programica.DOM.getElementsByClassName

if (!HTMLElement.prototype.getElementsByName)
	HTMLElement.prototype.getElementsByName = Programica.DOM.getElementsByName

if (!document.getElementsByName)
	document.getElementsByName = Programica.DOM.getElementsByName


/* кривоватый фикс addEventListener(...) для IE */
if (!window.addEventListener)
	HTMLElement.prototype.addEventListener = function (type, func, dir) { this.attachEvent('on' + type, func) },
	window.addEventListener = document.addEventListener = HTMLElement.prototype.addEventListener

if (!HTMLElement.prototype.addClassName)
	HTMLElement.prototype.addClassName = Programica.DOM.addClassName

if (!HTMLElement.prototype.remClassName)
	HTMLElement.prototype.remClassName = Programica.DOM.remClassName

//——————————————————————————————————————————————————————————————————————————————
// Типа, прототип :)

//Error.prototype.toString = function ()
//{
//	var arr = new Array()
//	for (var i in this) arr.push(i + ':' + this[i])
//	return this.message + ': {' + arr.join(', ') + '}'
//}
//
//Function.prototype.toString = function () {return "function()"}
//
//Object.prototype.toString = function ()
//{
//	var arr = new Array()
//	for (var i in this) arr.push(i + ':' + this[i])
//	return '{' + arr.join(', ') + '}'
//}
//
//Array.prototype.toString = function ()
//{
//	return '[' + this.join(', ') + ']'
//}
//
//String.prototype.toString = function ()
//{
//	var str = this.replace(/\\/,'\\\\')
//	str = str.replace(/"/,'\\"')
//	return '"' + str + '"'
//}

// расширяем напрямик
function extend (to, from)
{
	if (!to || !from) return null
	
	for (var p in from)
		if (to[p] == undefined)
			to[p] = from[p]
	
	return to
}

// "наследуем", играясь с прототипом
function inherit (to, from)
{
	if (!to || !from) return null
	
	var newp = {}
	newp.prototype = to.prototype
	to.prototype = newp
	
	for (var p in from)
		if (to.prototype[p] == undefined)
			to[p] = from[p]
	
	return to
}

function $ (id) { return document.getElementById(id) }

if (!window.console) console = { log: function () {} }


//——————————————————————————————————————————————————————————————————————————————


log("Programica.js loaded")
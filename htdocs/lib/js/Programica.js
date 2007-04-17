
var isDebug = 0

// заранее объявляем «пространства имен»

var Programica = {}
Programica.Abstract = {}


function log (str)
{
	if (!isDebug) return
	//log.elem.innerHTML += "<p>" + str + "</p><hr/>"
	log.elem.innerHTML += str + "\n"
	
	if (document.body)
		document.body.appendChild(log.elem)
}

log.elem = document.createElement("pre")
log.elem.id = "log-elem"


if (isDebug) log("Programica.js loaded")


//if (!window.HTMLElement) window.HTMLElement = window["[[DOMElement.prototype]]"] || {}
if (!window.HTMLElement) window.HTMLElement = {}
if (!HTMLElement.prototype) HTMLElement.prototype = window["[[DOMElement.prototype]]"] || {}


//——————————————————————————————————————————————————————————————————————————————


Error.prototype.toString = function ()
{
	var arr = new Array()
	for (var i in this) arr.push(i + ':' + this[i])
	return this.message + ': {' + arr.join(', ') + '}'
}

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


function extend (to, from)
{
	for (var p in from)
		if (to[p] == undefined)
			to[p] = from[p]
}

Function.prototype.toString = function () {return "function()"}

function $(id) { return document.getElementById(id) }

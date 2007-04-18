
var isDebug = 0

// заранее объявляем «пространства имен»

var Programica = {}
Programica.Abstract = {}


//——————————————————————————————————————————————————————————————————————————————
// Логи

log.elem = document.createElement("pre")
log.elem.id = "log-elem"

function log (str)
{
	if (!isDebug) return str
	
	if (console && console.log) return console.log(str)
	
	log.elem.innerHTML += str + "\n"
	
	if (document.body)
		document.body.appendChild(log.elem)
	
	return str
}



if (!window.HTMLElement) window.HTMLElement = {}
if (!HTMLElement.prototype) HTMLElement.prototype = window["[[DOMElement.prototype]]"] || {}


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

function $(id) { return document.getElementById(id) }


//——————————————————————————————————————————————————————————————————————————————


log("Programica.js loaded")

// объявляем пространства
if (!self.Programica) self.Programica = {}
Programica.ns070909 = 'http://www.programica.ru/2007/09/09'
Programica.XMLNS = {'http://www.programica.ru/2007/09/09':'pmc'}

//——————————————————————————————————————————————————————————————————————————————
// Логи

try
{
	if (self.console && self.console.firebug)
		// для Firebug
		self.log = console.log
		
	else if (self.console && self.console.log)
		// для Сафари и компании
		self.log = function ()
		{
			var arr = []
			for (var i = 0; i < arguments.length; i++)
				arr.push(arguments[i])
			return console.log(arr.join(', '))
		}
		
	else if (self.opera && opera.postError)
		// для Оперов
		self.log = function () { return opera.postError(arguments) }
		
	else
		// для "всИЕх"
		self.log = function () { return false }
}
catch (ex)
{
	// для глючащих
	self.log = function () { return false }
}

self.log3 = function () { if (Programica.debugLevel > 2) self.log.apply(this, arguments) }
self.log2 = function () { if (Programica.debugLevel > 1) self.log.apply(this, arguments) }


//——————————————————————————————————————————————————————————————————————————————
// Ближе к прототипу

self.safari2 = /AppleWebKit\/4/i.test(navigator.userAgent)
self.safari3 = /AppleWebKit\/5/i.test(navigator.userAgent)

if (!self.Element)
	Element = {}

if (!Element.prototype)
	Element.prototype = document.createElement('div').__proto__ || {}

if (!self.HTMLFormElement)
	HTMLFormElement = {}

if (!HTMLFormElement.prototype)
	HTMLFormElement.prototype = document.createElement('form').__proto__ || {}

// Напрямик
function extend (to, from)
{
	if (!to || !from) return null
	
	for (var p in from)
		if (to[p] == undefined)
			to[p] = from[p]
	
	return to
}

if (!String.localeCompare)
	String.localeCompare = function (a, b) { return a < b ? -1 : (a > b ? 1 : 0) }

function stringify (obj)
{
	var props = []
	for (var i in obj)
		props.push(i + ': ' + obj[i])
	
	return '{' + props.join(', ') + '}'
}

function $   (id)   { return document.getElementById(id) }
function $$  (cn)   { return document.getElementsByClassName(cn) }
function $$$ (cn)   { return document.getElementsByTagName(cn) }
function $E  (type, props)
{
	var node = document.createElement(type)
	
	if (props)
		for (var i in props)
			node.setAttribute(i, props[i])
	
	return node
}

$.onload = function (fn) { return self.addEventListener('load', fn, false) }

Math.longRandom = function ()
{
	return (new Date()).getTime().toString() + Math.round(Math.random() * 1E+17)
}


log2("Programica.thin.js loaded")

// объявляем пространство

if (!window.Programica) window.Programica = {}
Programica.ns070909 = 'http://www.programica.ru/2007/09/09'

//——————————————————————————————————————————————————————————————————————————————
// Логи

if (window.console && console.firebug)
	// для Firebug
	window.log = console.log
	
else if (window.console && window.console.log)
	// для Сафари и компании
	window.log = function ()
	{
		var arr = []
		for (var i = 0; i < arguments.length; i++)
			arr.push(arguments[i])
		return console.log(arr.join(', '))
	}
	
else if (window.opera && opera.postError)
	// для Оперов
	window.log = function () { return opera.postError(arguments) }
	
else
	// для "всИЕх"
	window.log = function () { return false }


window.log3 = function () { if (Programica.debugLevel > 2) window.log.apply(this, arguments) }
window.log2 = function () { if (Programica.debugLevel > 1) window.log.apply(this, arguments) }


//——————————————————————————————————————————————————————————————————————————————
// Ближе к прототипу

window.safari2 = /AppleWebKit\/4/i.test(navigator.userAgent)
window.safari3 = /AppleWebKit\/5/i.test(navigator.userAgent)

if (!window.Element)
	Element = {}

if (!Element.prototype)
	Element.prototype = document.createElement('div').__proto__ || {}

if (!window.HTMLFormElement)
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

Math.longRandom = function ()
{
	return (new Date()).getTime().toString() + Math.round(Math.random() * 1E+17)
}


log2("Programica.thin.js loaded")
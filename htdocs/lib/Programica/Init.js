
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

String.prototype.plural = Number.prototype.plural = function (a, b, c)
{
	if (this % 1)
		return b
	
	var v = Math.abs(this) % 100
	if (11 <= v && v <= 19)
		return c
	
	v = v % 10
	if (2 <= v && v <= 4)
		return b
	if (v == 1)
		return a
	
	return c
}

Date.rusMonths = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь']

Date.rusMonths2 = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря']

Date.prototype.toRusDate = function ()
{
	return this.getDate() + ' ' + Date.rusMonths2[this.getMonth()] + ' ' + this.getFullYear()
}

function stringify (obj)
{
	var props = []
	for (var i in obj)
		props.push(i + ': ' + obj[i])
	
	return '{' + props.join(', ') + '}'
}

function $   (id)   { return document.getElementById(id) }
function $E  (type, props)
{
	var node = document.createElement(type)
	
	if (props)
		for (var i in props)
			node.setAttribute(i, props[i])
	
	return node
}

$.onload = function (fn) { return self.addEventListener('load', fn, false) }
$.include = function (src)
{
	var node = document.createElement('script')
	node.type = 'text/javascript'
	node.src = src
	document.getElementsByTagName('head')[0].appendChild(node)
	return node
}

Math.longRandom = function ()
{
	return (new Date()).getTime().toString() + Math.round(Math.random() * 1E+17)
}

// light infantile browser matching
Programica.userAgentRegExps =
{
	MSIE: /MSIE/,
	MSIE6: /MSIE 6/,
	MSIE7: /MSIE 7/,
	Gecko: /Gecko/,
	Opera: /Opera/,
	Opera9: /Opera\/9/,
	Safari: /AppleWebKit/,
	Safari2: /AppleWebKit\/4/,
	Safari3: /AppleWebKit\/5/
}
        
Programica.htmlUserAgentSetter = function (doc, ua)
{
	doc = doc || document
	ua = ua || navigator.userAgent
	
	var htmlNode = doc.documentElement
	for (var p in this.userAgentRegExps)
		if (this.userAgentRegExps[p].test(ua))
			htmlNode.className = (htmlNode.className || '') + ' ' + p
}

log2("Programica/Init.js loaded")
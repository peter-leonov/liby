
// заранее объявляем "пространства имен"

if (!window.Programica) window.Programica = {}


//——————————————————————————————————————————————————————————————————————————————
// Логи

Programica.serverType = '<!--#echo var="SERVER_TYPE" -->'
Programica.debugLevel = 1
Programica.ns070909 = 'http://www.programica.ru/2007/09/09'


if (window.console && console.firebug)
	// для Firebug
	log = console.log
	
else if (window.console && window.console.log)
	// для Сафари и компании
	log = function ()
	{
		var arr = []
		for (var i = 0; i < arguments.length; i++)
			arr.push(arguments[i])
		return console.log(arr.join(', '))
	}
	
else if (window.opera && opera.postError)
	// для Оперов
	log = function () { return opera.postError(arguments) }
	
else
	// для "всИЕх"
	log = function () { return false }


function log3 () { if (Programica.debugLevel >= 3) log.apply(this, arguments) }
function log2 () { if (Programica.debugLevel >= 2) log.apply(this, arguments) }


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

//——————————————————————————————————————————————————————————————————————————————

Programica.get = function (url)
{
	var r = window.XMLHttpRequest ? (new XMLHttpRequest()) : (new ActiveXObject("Msxml2.XMLHTTP"))
	r.open('GET', url, false)
	r.send(null)
	return r.responseText
}

Programica.require = function (src)
{
	document.head = document.getElementsByTagName('head')[0]
	
	// cecking write() cousre it may throw an exeption in XHTML
	var cantWriteScript = !!window.opera
	try { document.write(' ') }
	catch (ex) { cantWriteScript = true }
	
	if (document.write && !cantWriteScript)
		document.write('<script type="text/javascript" src=' + src + '></script>')
	else if (document.head && !window.safari3)
	{
		//if (document.head.firstChild)
		//	document.head.insertBefore($E('script', {type:"text/javascript", src:src}), document.head.firstChild)
		//else
			document.head.appendChild($E('script', {type:"text/javascript", src:src}))
	}
	else if (Programica.get)
	{
		var code = Programica.get(src)
		//alert(src + '\n' + code)
		window.eval ? window.eval(code) : eval(code)
	}
	else
		alert('Can`t find the way to require "' + src + '"')
}

<!--#if expr="$SERVER_TYPE=/development/" -->
	
	log2('Development mode')
	
	<!--#if expr="$HTTP_USER_AGENT = /Gecko\//" -->
		Programica.require("/lib/Programica/FFFixes.js")
	<!--#endif -->
	
	<!--#if expr="$HTTP_USER_AGENT = /MSIE/" -->
		Programica.require("/lib/Programica/IEFixes.js")
	<!--#endif -->
	
	<!--#if expr="$HTTP_USER_AGENT = /AppleWebKit\/4/" -->
		Programica.require("/lib/Programica/WK4Fixes.js")
	<!--#endif -->
		
	
	Programica.require("/lib/Programica/Development.js")
	
	Programica.require("/lib/Programica/DOM.js")
	Programica.require("/lib/Programica/Animation.js")
	Programica.require("/lib/Programica/Request.js")
	Programica.require("/lib/Programica/Form.js")
	Programica.require("/lib/Programica/Widget.js")

<!--#else -->
	
	Programica.debugLevel = 0
	
	<!--#if expr="$HTTP_USER_AGENT = /Gecko\//" -->
		<!--#include virtual="/lib/Programica/FFFixes.js" -->
	<!--#endif -->
	
	<!--#if expr="$HTTP_USER_AGENT = /MSIE/" -->
		<!--#include virtual="/lib/Programica/IEFixes.js" -->
	<!--#endif -->
	
	<!--#if expr="$HTTP_USER_AGENT = /AppleWebKit\/4/" -->
		<!--#include virtual="/lib/Programica/WK4Fixes.js" -->
	<!--#endif -->
	
	<!--#include virtual="/lib/Programica/DOM.js" -->
	<!--#include virtual="/lib/Programica/Animation.js" -->
	<!--#include virtual="/lib/Programica/Request.js" -->
	<!--#include virtual="/lib/Programica/Form.js" -->
	<!--#include virtual="/lib/Programica/Widget.js" -->
	
<!--#endif -->


log2("Programica.js loaded")
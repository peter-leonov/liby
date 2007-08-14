
// заранее объявляем "пространства имен"

if (!window.Programica) window.Programica = {}
if (!window.Programica.DOM) Programica.DOM = {}


//——————————————————————————————————————————————————————————————————————————————
// Логи

Programica.debugLevel = 1

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
// Безобидные полезности


// малюсенькая реализация запроса
Programica.get = function (url) { var r = window.XMLHttpRequest ? (new XMLHttpRequest()) : (new ActiveXObject("Msxml2.XMLHTTP")); r.open('GET', url, false); r.send(null); return r.responseText }

// типа инклуды с реквайрами
function require ()
{
	for (var i = 0; i < arguments.length; i++)
	{
		if (!require.sripts[arguments[i]])
		{
			log2('require "' + arguments[i] + '"')
			
			if (document.write)
				document.write('<script type="text/javascript" src="' + arguments[i] + '"></script>');
			else
			{
				var code = Programica.get(arguments[i])
				window.eval ? window.eval(code) : eval(code)
			}
			
			require.sripts[arguments[i]] = 1
		}
	}
}
require.sripts = []



//——————————————————————————————————————————————————————————————————————————————
// Ближе к прототипу

if (!window.HTMLElement) HTMLElement = {}
if (!window.XULElement) XULElement = { prototype: {} }
if (!HTMLElement.prototype) HTMLElement.prototype = document.createElement('div').__proto__ || {}

if (!window.HTMLFormElement) HTMLFormElement = {}
if (!HTMLFormElement.prototype) HTMLFormElement.prototype = document.createElement('form').__proto__ || {}

// Напрямик
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
		newp[p] = from[p]
	
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


//——————————————————————————————————————————————————————————————————————————————

if (/MSIE/.test(navigator.userAgent))
	require('/lib/Programica/IEFixes.js')

require('/lib/Programica/DOM.js')
require('/lib/Programica/Animation.js')
require('/lib/Programica/Request.js')
require('/lib/Programica/Form.js')
require('/lib/Programica/Widget.js')

log2("Programica.js loaded")
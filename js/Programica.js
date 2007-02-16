
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


$.onready = function (fn) { return this.onready.listeners.push(fn) }
$.onready.done = 0
$.onready.listeners = []
$.onready.run = function (e)
{
	if (this.done++)
		return
	
	if (!e)
		e = {type:'contentready'}
	
	var listeners = this.listeners
	for (var i = 0; i < listeners.length; i++)
		listeners[i].call(document, e)
}
$.onload(function (e) { $.onready.run(e) })
self.addEventListener('DOMContentLoaded', function (e) { $.onready.run(e) }, false)
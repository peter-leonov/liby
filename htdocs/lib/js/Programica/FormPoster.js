
Programica.FormPoster = function () {}

Programica.FormPoster.prototype = new Programica.Widget()
Programica.FormPoster.prototype.mainNodeTagName = 'form'
Programica.FormPoster.prototype.klass = 'Programica.FormPoster'
Programica.FormPoster.prototype.Handler = function (node)
{
	this.mainNode = node
	var t = this
	
	var listener = function (e)
	{
		if (!/^ajax$/i.test(this.getAttribute("target"))) return
		
		
		e.preventDefault()
	}
	
	node.addEventListener('submit', listener, false)
}


Programica.FormPoster.prototype.Handler.prototype =
{
	init: function () { /*пусто*/ }
}

Programica.Widget.register(new Programica.FormPoster())
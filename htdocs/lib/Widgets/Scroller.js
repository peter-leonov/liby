
Programica.Scroller = function () {}

Programica.Scroller.prototype = new Programica.Widget()
Programica.Scroller.prototype.mainNodeClassName = 'programica-scroller'
Programica.Scroller.prototype.klass = 'Programica.Scroller'
Programica.Scroller.prototype.Handler = function (node)
{
}

Programica.Scroller.prototype.Handler.prototype =
{
	init:			function ()		{  }
}

Programica.Widget.register(new Programica.Scroller())


Programica.Trackbar = function () {}

Programica.Trackbar.prototype = new Programica.Widget()
Programica.Trackbar.prototype.mainNodeClassName = 'programica-trackbar'
Programica.Trackbar.prototype.klass = 'Programica.Trackbar'
Programica.Trackbar.prototype.Handler = function (node)
{
	this.mainNode = node
	this.mainNode.Trackbar = this
	
	this.dragger = this.my('dragger')[0]
	
	this.dragger.addEventListener
	(
		'mousedown',
		function (e)
		{
			alert(e)
		},
		false
	)
}

Programica.Trackbar.prototype.Handler.prototype =
{
	init:			function ()		{  },
	
	my: function (cn, node)
	{
		var root = (node || this.mainNode)
		cn = this.ns ? (this.ns + "-" + cn) : cn
		return (root && root.getElementsByClassName) ? root.getElementsByClassName(cn) : []
	},
}

Programica.Widget.register(new Programica.Trackbar())


log2("Widget/Trackbar.js loaded")
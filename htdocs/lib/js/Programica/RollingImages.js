
Programica.RollingImages = function () {}

Programica.RollingImages.prototype = new Programica.Widget()
Programica.RollingImages.prototype.mainNodeClassName = 'programica-rolling-images'
Programica.RollingImages.prototype.Handler = function (node)
{
	this.mainNode = node
	
	this.ns					= this.mainNode.getAttribute('animation-namespace')
	this.viewport			= this.my('viewport')[0]
	this.points				= this.my('point')
	this.buttons			= this.my('button')
	this.aPrev				= this.my('prev')[0]
	this.aNext				= this.my('next')[0]
	this.current			= 0
	
	var t = this
	if (this.aPrev)
		this.aPrev.onmousedown = function () { t.goPrev() },
		this.aPrev.onselectstart = function () { return false }
	
	if (this.aNext)
		this.aNext.onmousedown = function () { t.goNext() },
		this.aNext.onselectstart = function () { return false }
	
	for (var i = 0, il = this.buttons.length; i < il; i++)
		//да, в жабаскрипте приходится так изголяться с замыканиями (в IE работает)
		this.buttons[i].onmousedown = (function (fi) { return function () { t.goToFrame(fi) } })(i)
}

Programica.RollingImages.prototype.Handler.prototype =
{
	init:			function ()		{ this.goInit() },
	goPrev:			function ()		{ if (this.current > 0) this.goToFrame((this.points.length + this.current - 1) % this.points.length) },
	goNext:			function ()		{ if (this.current < this.points.length - 1) this.goToFrame((this.current + 1) % this.points.length) },
	
	animationType:	function ()		{ return this.mainNode.getAttribute('animation-type') || 'easeOutBack' },
	getDuration:	function ()		{ return this.mainNode.getAttribute('animation-duration') || 1 },
	my:				function (cn)	{ return this.mainNode.getElementsByClassName(this.ns ? (this.ns + "-" + cn) : cn) },
	
	goInit: function (n)
	{
		var node = this.my('selected')[0]
		if (node)
			this.goToNode(node, 'directJump')
		else
			this.goToFrame(0, 'directJump')
		
		return n
	},
	
	goToFrame: function (n, anim)
	{
		n = n || 0
		this.goToNode(this.points[n], anim)
		
		this.current = n
		this.updateNavigation()
		
		return n
	},
	
	goToNode: function (node, anim)
	{
		if (!node) return
		anim = anim || this.animationType()
		
		for (var i = 0, il = this.points.length; i < il; i++)
			if (this.points[i] == node) this.current = i
		
		log(this.current + ': offsetTop = ' + node.offsetTop + ', offsetLeft = ' + node.offsetLeft)
		if (!this.viewport) log('Viewport is undefined!')
		if (!this.viewport.animate) log('Viewport can`t be animated!')
		
		// поиграем в CSS
		switch (this.mainNode.getAttribute('animation-align') || 'left-top')
		{
			case 'center':
			case 'middle':
				// наводим на центр выбранной ноды
				var left = Math.round( node.offsetLeft + (node.offsetWidth  / 2) - (this.viewport.offsetWidth  / 2) )
				var top  = Math.round( node.offsetTop  + (node.offsetHeight / 2) - (this.viewport.offsetHeight / 2) )
				break
			
			case 'left-top':
				// лево верх
				var left = node.offsetLeft
				var top  = node.offsetTop
				break
			
			case 'right-buttom':
				// право низ
				var left = node.offsetLeft + node.offsetWidth  - this.viewport.offsetWidth
				var top  = node.offsetTop  + node.offsetHeight - this.viewport.offsetHeight
				break
			
			default:
				log('Unknown animation-align type: ' + this.mainNode.getAttribute('animation-align'))
		}
		
		var trans = {scrollTop:  [top], scrollLeft: [left]}
		
		{
			var scale = this.viewport.getAttribute("scale")
			
			if (/all|height/.test(scale))
				trans.height = [node.offsetHeight]
				
			if (/all|width/.test(scale))	
				trans.wifth  = [node.offsetWidth]
		}
		
		//this.viewport.scrollTop = node.offsetTop, this.viewport.scrollLeft = node.offsetLeft
		this.viewport.animate(anim, trans,  this.getDuration()).start()
		
		this.updateNavigation()
	},
	
	updateNavigation: function ()
	{
		var button
		
		for (var i = 0, il = this.buttons.length; i < il; i++)
			button = this.buttons[i],
			button.className = button.className.replace(/ selected-button/g, '')
		
		button = this.buttons[this.current]
		if (button)
		{
			button.className = button.className.replace(/ selected-button/g, '')
			button.className += ' selected-button'
		}
		
		if (this.aPrev)
		{
			this.aPrev.className = this.aPrev.className.replace(/ disabled/g, '')
			!this.current ? this.aPrev.className += ' disabled' : this.aPrev.className = this.aPrev.className.replace(/ disabled/g, '')
		}
		
		if (this.aNext)
		{
			this.aNext.className = this.aNext.className.replace(/ disabled/g, '')
			this.current == this.points.length - 1 ? this.aNext.className += ' disabled' : this.aNext.className = this.aNext.className.replace(/ disabled/g, '')
		}
	}
}

Programica.Widget.register(new Programica.RollingImages())
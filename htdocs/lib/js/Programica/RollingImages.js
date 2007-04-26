
window.addEventListener('load', function () { Programica.RollingImages.onLoader() }, false)

Programica.RollingImages =
{
	bind: function (node)
	{
		node.pmc || (node.pmc = {});
		node.pmc.imageRoller = new Programica.RollingImages.Handler(node)
		node.pmc.imageRoller.goInit()
	},
	
	Handler: function (node)
	{
		this.mainNode = node
		var t = this
		
		this.viewport = node.getElementsByClassName('viewport')[0]
		this.points = node.getElementsByClassName('point')
		this.current = 0
		
		var as = node.getElementsByTagName('a')
		this.aPrev = node.getElementsByClassName('prev')[0]
		this.aNext = node.getElementsByClassName('next')[0]
		this.aPrev.onclick = function () { t.goPrev() }
		this.aNext.onclick = function () { t.goNext() }
		
	},
	
	onLoader: function ()
	{
		var all = document.getElementsByClassName('programica-rolling-images')
		
		for (var i = 0; i < all.length; i++)
			this.bind(all[i])
	}
}

Programica.RollingImages.Handler.prototype =
{
	goPrev: function () { if (this.current > 0) this.go((this.points.length + this.current - 1) % this.points.length) },
	goNext: function () { if (this.current < this.points.length - 1) this.go((this.current + 1) % this.points.length) },
	
	defaultAnimationType: function () { return this.mainNode.getAttribute('animation-type') || 'easeOutBack' }, //easeOutBounce
	
	goInit: function (n)
	{
		var node = this.mainNode.getElementsByClassName('selected-node')[0]
		if (node)
			this.goToNode(node, 'directJump')
		else
			this.go(0, 'directJump')
		
		return n
	},
	
	go: function (n, anim)
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
		anim = anim || this.defaultAnimationType()
		
		for (var i = 0, il = this.points.length; i < il; i++)
			if (this.points[i] == node) this.current = i
		
		log(this.current + ': offsetTop = ' + node.offsetTop + ', offsetLeft = ' + node.offsetLeft)
		if (!this.viewport) log('Viewport is undefined!');
		if (!this.viewport.animate) log('Viewport can`t be animated!');
		
		if (anim == 'directJump')
			this.viewport.scrollTop = node.offsetTop, this.viewport.scrollLeft = node.offsetLeft
		else
			this.viewport.animate(anim, {scrollTop:  [node.offsetTop], scrollLeft: [node.offsetLeft]},  1).start()
		
		this.updateNavigation()
	},
	
	updateNavigation: function ()
	{
		this.aPrev.className = this.aPrev.className.replace(/ disabled/g, '')
		this.aNext.className = this.aNext.className.replace(/ disabled/g, '')
		
		!this.current ? this.aPrev.className += ' disabled' : this.aPrev.className = this.aPrev.className.replace(/ disabled/g, '')
		this.current == this.points.length - 1 ? this.aNext.className += ' disabled' : this.aNext.className = this.aNext.className.replace(/ disabled/g, '')
		//if (!this.current && this.current == this.points.length - 1) this.aPrev.className += ' disabled', this.aNext.className += ' disabled'
	}
}
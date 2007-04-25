
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
		this.node = node
		var t = this
		
		this.viewport = node.getElementsByClassName('viewport')[0]
		this.images = node.getElementsByClassName('point')
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
	goPrev: function () { if (this.current > 0) this.go((this.images.length + this.current - 1) % this.images.length) },
	goNext: function () { if (this.current < this.images.length - 1) this.go((this.current + 1) % this.images.length) },
	
	animationType: function () { return this.node.getAttribute('animation-type') || 'easeOutBack' }, //easeOutBounce
	
	goInit: function (n)
	{
		n = n || 0
		var img = this.images[n]
		if (!img) return 0;
		if (!this.viewport) log('Viewport is undefined!');
		
		this.viewport.scrollTop = img.offsetTop
		this.viewport.scrollLeft = img.offsetLeft
		
		this.current = n
		this.updateNavigation()
		return n
	},
	
	go: function (n)
	{
		var img = this.images[n]
		if (!img) return 0
		if (!this.viewport) log('Viewport is undefined!');
		
		log(n + ': offsetTop = ' + img.offsetTop + ', offsetLeft = ' + img.offsetLeft)
		
		this.viewport.animate(this.animationType(), {scrollTop:  [img.offsetTop], scrollLeft: [img.offsetLeft]},  1).start()
		
		this.current = n
		this.updateNavigation()
		return n
	},
	
	updateNavigation: function ()
	{
		!this.current ? this.aPrev.className += ' disabled' : this.aPrev.className = this.aPrev.className.replace(/ disabled/g, '')
		this.current == this.images.length - 1 ? this.aNext.className += ' disabled' : this.aNext.className = this.aNext.className.replace(/ disabled/g, '')
		if (!this.current && this.current == this.images.length - 1) this.aPrev.className += ' disabled', this.aNext.className += ' disabled'
	}
}
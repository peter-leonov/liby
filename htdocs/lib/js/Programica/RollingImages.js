function $ (id) { return document.getElementById(id) }

if (!window.console) console = { log:function(){} }

if (!window.Programica) var Programica = {}

Programica.RollingImages =
{
	bind: function (node)
	{
		node.pmc || (node.pmc = {});
		node.pmc.imageRoller = new Programica.RollingImages.Handler(node)
		node.pmc.imageRoller.go(0)
	},
	
	Handler: function (node)
	{
		this.node = node
		var t = this
		
		this.viewport = node.getElementsByTagName('div')[0]
		this.images = node.getElementsByTagName('img')
		this.current = 0
		
		var as = node.getElementsByTagName('a')
		this.aPrev = as[0]
		this.aNext = as[1]
		this.aPrev.onclick = function () { t.goPrev() }
		this.aNext.onclick = function () { t.goNext() }
		
	},
	
	onLoader: function ()
	{
		var all = document.getElementsByClassName
		
		this.bind($("rolling-images1"))
	}
}

Programica.RollingImages.Handler.prototype =
{
	goPrev: function () { if (this.current > 0) this.go((this.images.length + this.current - 1) % this.images.length) },
	goNext: function () { if (this.current < this.images.length - 1) this.go((this.current + 1) % this.images.length) },
	
	go: function (n)
	{
		var img = this.images[n]
		if (!img) return 0
		
		log(n + '.offsetTop = ' + img.offsetTop)
		
		this.viewport.animate('easeOutBounce', {scrollTop: [img.offsetTop]}, 1).start()
		//this.viewport.scrollTop = img.offsetTop
		
		!n ? this.aPrev.className += ' disabled' : this.aPrev.className = this.aPrev.className.replace(/ disabled/g, '')
		n == this.images.length - 1 ? this.aNext.className += ' disabled' : this.aNext.className = this.aNext.className.replace(/ disabled/g, '')
		if (!n && n == this.images.length - 1) this.aPrev.className += ' disabled', this.aNext.className += ' disabled'
		
		this.current = n
		return n
	}
}
;(function(){

var myName = 'LazyScroller',
	Me = self[myName] = Class(myName)

Me.mixIn(EventDriven)

Me.prototype.extend
({
	initialize: function ()
	{
		this.nodes = {}
		this.conf = {range: 2, count: Infinity}
	},
	
	bind: function (scroller)
	{
		// onscroll loader
		var conf = this.conf, rangeFinder = this.rangeFinder = new ScrollRangeFinder(),
			images = scroller.nodes.points
		
		function imageLoaded () { this.lazyLoadind = false; this.lazyLoaded = true }
		for (var i = 0; i < images.length; i++)
			images[i].addEventListener('load', imageLoaded, false)
		
		function scrolled (e)
		{
			var ranges = e.ranges
			for (var i = 0; i < ranges.length; i++)
			{
				var image = images[i], lazy
				if (!image.lazyLoadind && !image.lazyLoaded && ranges[i] <= conf.range)
				{
					lazy = image.getAttribute('lazy')
					if (lazy)
					{
						image.src = lazy
						image.lazyLoadind = true
					}
					else
						image.lazyLoaded = true
				}
			}
		}
		rangeFinder.addEventListener('scroll', scrolled, false)
		rangeFinder.bind(scroller.nodes.viewport, images)
		
		var rotator = this.rotator = new ScrollerRotator()
		rotator.conf.count = this.conf.count
		
		function mayRotate (e)
		{
			if (!this.scroller.nodes.points[e.next].lazyLoaded)
				e.preventDefault()
		}
		rotator.addEventListener('rotate', mayRotate, false)
		rotator.bind(scroller).start()
		
		return this
	}
})


})();
// ScrollRangeFinder
;(function(){

var myName = 'ScrollRangeFinder',
	max = Math.max, sqrt = Math.sqrt

function Me ()
{
	this.nodes = {}
	this.vals = {}
}

Me.prototype =
{
	interval: 1000,
	
	bind: function (main, images)
	{
		var nodes = this.nodes
		
		nodes.main = main
		nodes.images = images
		
		this.precalc()
		
		this.monitor(true)
	},
	
	precalc: function ()
	{
		var images = this.nodes.images, circles = this.circles = [],
			image, i, x, y, w, h, cx, cy, r
		
		for (i = 0; i < images.length; i++)
		{
			image = images[i]
			x = image.offsetLeft
			y = image.offsetTop
			w = image.offsetWidth
			h = image.offsetHeight
			cx = x + w / 2
			cy = y + h / 2
			r = max(w, h) / 2
			
			circles[i] = {cx: cx, cy: cy, r: r}
		}
		
	},
	
	changed: function (old, pos)
	{
		var nodes = this.nodes, main = nodes.main, circles = this.circles,
			w = main.offsetWidth, h = main.offsetHeight,
			i, circle, dx, dy, d,
			cx = pos.x + w / 2, cy = pos.y + h / 2,
			s = max(w, h), ranges = []
			// box = {w: main.scrollWidth, h: main.scrollHeight}
		
		for (i = 0; i < circles.length; i++)
		{
			circle = circles[i]
			
			dx = circle.cx - cx
			dy = circle.cy - cy
			
			d = sqrt(dx*dx + dy*dy) - circle.r - s / 2
			
			ranges[i] = d / s + 1
		}
		
		this.dispatchEvent({type: 'scroll', ranges: ranges})
	},
	
	check: function ()
	{
		var main = this.nodes.main, oldVals = this.vals,
			newVals = {x: main.scrollLeft, y: main.scrollTop}
		
		if (newVals.x !== oldVals.x || newVals.y !== oldVals.y)
		{
			this.changed(oldVals, newVals)
			this.vals = newVals
		}
	},
	
	monitor: function (start)
	{
		clearInterval(this.timer)
		if (start)
		{
			var me = this
			function check () { me.check() }
			this.timer = window.setInterval(check, this.interval)
			me.check()
		}
	}
}

Me.mixIn(EventDriven)

self[myName] = Me
Me.className = myName

})();
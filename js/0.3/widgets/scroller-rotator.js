;(function(){

var myName = 'ScrollerRotator',
	Me = self[myName] = Class(myName)

Me.mixIn(EventDriven)

Me.prototype.extend
({
	initialize: function ()
	{
		this.conf = {time: 5, dir: 1, count: Infinity}
		this.loaded = []
	},
	
	configure: function (conf) { Object.extend(this.conf, conf) },
	
	bind: function (scroller, conf)
	{
		// image.onload = function () { alert(image.src) }
		// big images rotator
		this.scroller = scroller
		var me = this
		scroller.addEventListener('select', function (e) { me.onSelect(e) }, false)
		
		return this
	},
	
	onSelect: function (e)
	{
		if (e.origin == 'user')
			this.stop()
	},
	
	start: function ()
	{
		this.stop()
		var me = this, conf = this.conf
		this.count = conf.count
		this.dir = conf.dir
		this.timer = setInterval(function () { me.rotate() }, this.conf.time * 1000)
	},
	
	stop: function ()
	{
		clearInterval(this.timer)
	},
	
	rotate: function ()
	{
		if (--this.count <= 0)
			this.stop()
		else
		{
			var next = this.getNext()
			if (next >= 0 && this.dispatchEvent({type:'rotate', next:next}))
				this.scroller.goToFrame(next)
		}
	},
	
	getNext: function ()
	{
		var scroller = this.scroller,
			len = scroller.nodes.points.length,
			cur = scroller.current, next
		
		if (len < 2)
			return -1
		
		next = cur + this.dir
		
		if (next <= 0 || next + 1 >= len)
			this.dir *= -1
		
		return Math.round(next)
	}
})


})();
;(function(){

var myName = 'Scroller',
	Me = self[myName] = Class(myName),
	doc = document

Me.mixIn(EventDriven)

Me.prototype.extend
({
	initialize: function ()
	{
		this.nodes = {points:[]}
		this.conf =
		{
			duration: 1,
			animation: 'easeOutBack',
			auto: 0.5
		}
	},
	
	bind: function (main, conf)
	{
		Object.extend(this.conf, conf)
		this.nodes.main = main
		
		var me = this
		function mouseup (e)
		{
			e.preventDefault()
			clearInterval(me.autoTimer)
			doc.removeEventListener('mouseup', mouseup, false)
		}
		
		function meGoPrev () { me.goPrev(); me.dispatchSelect({origin:'user'}) }
		function meGoNext () { me.goNext(); me.dispatchSelect({origin:'user'}) }
		
		this.prevmousedown = function (e)
		{
			e.preventDefault()
			clearInterval(me.autoTimer)
			meGoPrev()
			me.autoTimer = setInterval(meGoPrev, me.conf.duration * 1000 * me.conf.auto + 150)
			doc.addEventListener('mouseup', mouseup, false)
		}
		
		this.nextmousedown = function (e)
		{
			e.preventDefault()
			clearInterval(me.autoTimer)
			meGoNext()
			me.autoTimer = setInterval(meGoNext, me.conf.duration * 1000 * me.conf.auto + 150)
			doc.addEventListener('mouseup', mouseup, false)
		}
		
		this.sync()
		this.goInit()
		
		return this
	},
	
	sync: function ()
	{
		var nodes = this.nodes
		nodes.viewport = this.my('viewport')[0]
		if (!nodes.viewport)
			throw new Error('Can`t find viewport for ' + nodes.main)
		if (!nodes.viewport.animate)
			throw new Error('Viewport can`t be animated!')
		
		nodes.points = this.my('point')
		nodes.prev = this.my('prev')[0]
		nodes.next = this.my('next')[0]
		
		// if syncing when pushed
		clearInterval(this.autoTimer)
		
		if (nodes.prev)
			nodes.prev.addEventListener('mousedown', this.prevmousedown, false)
		
		if (nodes.next)
			nodes.next.addEventListener('mousedown', this.nextmousedown, false)
		
		this.updateNavigation()
	},
	
	goPrev: function () { if (this.current > 0) this.goToFrame(this.current - 1) },
	goNext: function () { if (this.current < this.nodes.points.length - 1) this.goToFrame(this.current + 1) },
	my: function (cn) { return this.nodes.main.getElementsByClassName(cn) },
	
	guessCurrent: function (node)
	{
		var n = this.nodes.points.indexOf(node)
		if (n >= 0)
			this.setCurrent(i)
	},
	
	goInit: function (n) { this.goToFrame(n || 0, 'directJump'); return n },
	
	goToFrame: function (n, anim, dur)
	{
		var node = this.nodes.points[n || 0]
		if (node)
		{
			this.setCurrent(n)
			return this.goToNode(node, anim, dur)
		}
		return null
	},
	
	goToNode: function (node, anim, dur)
	{
		if (!node)
			return null
		
		return this.animateTo(node.offsetLeft, node.offsetTop, anim, dur)
	},
	
	animateTo: function (left, top, anim, dur)
	{
		return this.nodes.viewport.animate(anim || this.conf.animation, {scrollLeft: left, scrollTop: top}, dur || this.conf.duration)
	},
	
	jumpTo: function (left, top)
	{
		var viewport = this.nodes.viewport
		viewport.scrollLeft = left
		viewport.scrollTop = top
	},
	
	jumpToNode: function (node)
	{
		if (!node)
			return null
		
		this.jumpTo(node.offsetLeft, node.offsetTop)
	},
	
	jumpToFrame: function (n)
	{
		var node = this.nodes.points[n]
		if (node)
		{
			this.setCurrent(n)
			this.jumpToNode(node)
		}
	},
	
	updateNavigation: function ()
	{
		var nodes = this.nodes
		
		if (nodes.prev)
			nodes.prev.toggleClassName('disabled', this.current <= 0)
		
		if (nodes.next)
			nodes.next.toggleClassName('disabled', this.current >= nodes.points.length - 1)
	},
	
	setCurrent: function (num)
	{
		if (this.current !== num)
		{
			this.current = num
			this.updateNavigation()
			this.dispatchSelect()
		}
	},
	
	dispatchSelect: function (opts)
	{
		var num = this.current, node = this.nodes.points[num],
			event = {type:'select', node: node, number:num}
		
		if (opts)
			Object.extend(event, opts)
		this.dispatchEvent(event)
	}
})


})();
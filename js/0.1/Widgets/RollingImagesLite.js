
Programica.RollingImagesLite = function (node, prms)
{
	this.duration = 1
	this.animationType = 'easeOutBack'
	this.current = null
	this.mainNode = node
	this.mainNode.RollingImagesLite = this
	Object.extend(this, prms)
	
	var t = this
	function mouseup (e)
	{
		e.preventDefault()
		clearInterval(t.svInt)
		document.removeEventListener('mouseup', mouseup, false)
	}
	
	this.prevmousedown = function (e)
	{
		e.preventDefault()
		clearInterval(t.svInt)
		t.goPrev()
		t.svInt = setInterval(function () { t.goPrev() }, t.duration * 1000 * 0.5 + 150)
		document.addEventListener('mouseup', mouseup, false)
	}
	
	this.nextmousedown = function (e)
	{
		e.preventDefault()
		clearInterval(t.svInt)
		t.goNext()
		t.svInt = setInterval(function () { t.goNext() }, t.duration * 1000 * 0.5 + 150)
		document.addEventListener('mouseup', mouseup, false)
	}
	
	this.sync()
	this.goInit()
}

Programica.RollingImagesLite.prototype =
{
	sync: function ()
	{
		this.viewport = this.my('viewport')[0]
		if (!this.viewport)
			throw new Error('Can`t find viewport for ' + this.mainNode)
		if (!this.viewport.animate)
			throw new Error('Viewport can`t be animated!')
		
		this.points = this.my('point')
		this.buttons = this.my('button')
		this.aPrev = this.my('prev')[0]
		this.aNext = this.my('next')[0]
		
		// if syncing when pushed
		clearInterval(this.svInt)
		
		var t = this
		if (this.aPrev)
			this.aPrev.addEventListener('mousedown', this.prevmousedown, false)
		
		if (this.aNext)
			this.aNext.addEventListener('mousedown', this.nextmousedown, false)
		
		for (var i = 0, il = this.buttons.length; i < il; i++)
			this.buttons[i].onmousedown = function (fi) { return function () { t.goToFrame(fi) } } (i)
		
		this.updateNavigation()
	},
	
	goPrev: function () { if (this.current > 0) this.goToFrame(this.current - 1) },
	goNext: function () { if (this.current < this.points.length - 1) this.goToFrame(this.current + 1) },
	my: function (cn) { return this.mainNode.getElementsByClassName(cn) },
	
	goInit: function ()
	{
		return this.goToFrame(0, 'directJump')
	},
	
	goToFrame: function (n, anim, dur) { return this.points ? this.goToNode(this.points[n || 0], anim, dur) : null },
	
	goToNode: function (node, anim, dur)
	{
		if (!node)
			return null
		
		if (this.mainNode.onjump)
			if (this.mainNode.onjump(node) === false)
				return null
		
		// change number of current node
		for (var i = 0, il = this.points.length; i < il; i++)
			if (this.points[i] == node)
				this.setCurrent(i)
		
		return this.animateTo(node.offsetLeft, node.offsetTop, anim, dur)
	},
	
	animateTo: function (left, top, anim, dur) { return this.viewport.animate(anim || this.animationType, {scrollLeft: left, scrollTop: top}, dur || this.duration) },
	
	jumpTo: function (left, top) { this.viewport.scrollLeft = left; this.viewport.scrollTop = top },
	jumpToFrame: function (n) { this.goToFrame(n, 'directJump') },
	
	updateNavigation: function ()
	{
		for (var i = 0, il = this.buttons.length; i < il; i++)
			this.buttons[i].remClassName('selected-button')
		
		var button = this.buttons[this.current]
		if (button)
			button.addClassName('selected-button')
		
		if (this.aPrev)
			this.current > 0 ? this.aPrev.enable() : this.aPrev.disable()
		
		if (this.aNext)
			this.current < this.points.length - 1 ? this.aNext.enable() : this.aNext.disable()
	},
	
	setCurrent: function (num)
	{
    // if (num == this.current)
		//	return
		
		this.current = num
		this.updateNavigation()
		
		var cp = this.points[this.current]
		if (this.onselect)
			this.onselect(cp, this.current)
		
		if (cp && cp.onselect)
			cp.onselect()
	}
}

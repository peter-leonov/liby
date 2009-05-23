;(function () {

var PA = Programica.Animation = function (prms)
{
	prms = prms || {}

	// defaults
	this.trans	= []
	this.duration			= prms.duration || 1,
	this.unit				= prms.unit != null ? prms.unit : PA.defaults.unit
	this.motion				= prms.motion || PA.defaults.type
	this.running			= false
	this.complete			= false
	this.node				= prms.node || false
	this.animationTypes		= PA.Types
	
	this.onstart = this.oncomplete = this.onstep = function () {}
	
	switch (typeof this.motion)
	{
		case 'string':
			this.motion = this.animationTypes[this.motion] || null
			break
		case 'function':
			break
		default:
			this.motion = null
	}
	
	if (prms.trans)
		for (var i = 0; i < prms.trans.length; i++)
			if (prms.trans[i])
				this.trans.push(prms.trans[i])
}

Element.prototype.animate = function (motion, props, duration, unit)
{
	var trans = []
	for (var i in props)
	{
		var pi = props[i]
		if (pi.length == 2)
			trans.push({property: i, begin: pi[0], end: pi[1]})
		else
			trans.push({property: i, begin: null, end: pi[0] || pi})
	}
	return new PA({node: this, motion: motion, duration: duration, trans: trans, unit: unit}).start()
}


PA.fps = 60
PA.defaults = {unit: 'px', type: 'linearTween'}

PA.prototype =
{
	start: function ()
	{
		// if animation is already started
		if (this.running)
			return this
		
		// only one animation per node for now
		if (this.node.animation)
			this.node.animation.stop()
		this.node.animation = this
		
		this.running = true
		this.complete = false
		
		var t = this
		if (this.motion == this.animationTypes.directJump)
		{
			this.frame = this.totalFrames - 1
			setTimeout(function () { t.renderForceLast(); t.stop(); t.complete = true; t.oncomplete() }, 0)
		}
		else
		{
			this.frame = 0
			this.totalFrames = this.duration * PA.fps
			
			for (var i = 0; i < this.trans.length; i++)
			{
				var tr = this.trans[i]
				if (tr.begin == null)
					tr.begin = this.getStyleProperty(tr.property)
				tr.step = ( tr.end - tr.begin ) / this.totalFrames
			}
			
			this.timer = PA.addTimer( function () { t.step() } )
		}
		
		this.onstart()
		return this
	},
	
	stop: function ()
	{
		if (this.running)
		{
			this.node.animation = null
			this.running = false
			PA.removeTimer(this.timer)
		}
		
		return this
	},
	
	step: function ()
	{
		this.render()
		this.onstep()
		
		if (this.frame >= this.totalFrames - 1)
		{
			this.stop()
			this.complete = true
			this.oncomplete()
		}
		
		this.frame++
	},
	
	renderForceLast: function ()
	{
		for (var i = 0; i < this.trans.length; i++)
		{
			var t = this.trans[i]
			this.setStyleProperty(t.property, t.end)
		}
	},
	
	render: function ()
	{
		for (var i = 0; i < this.trans.length; i++)
		{
			var t = this.trans[i]
			if ( t.property != null && t.begin != null && t.end != null  )
				this.setStyleProperty(t.property, this.motion(this.frame + 1, t.begin, t.end - t.begin, this.totalFrames))
			else
				throw new Error("Corupted transformation: " + t)
		}
	},

	getStyleProperty: function (p)
	{
		if (p == "top" && !this.node.style[p])
			return this.node.offsetTop
		
		if (p == "left" && !this.node.style[p])
			return this.node.offsetLeft
		
		
		if (p == "opacity" && isNaN(parseFloat(this.node.style[p])))
			return 1
		
		
		if (/scroll/.test(p))
			return this.node[p]
		
		return parseFloat(this.node.style[p]) || 0
	},
	
	setStyleProperty: function (p, value)
	{
		try
		{
			if (/color/.test(p))
				return this.node.style[p] = 'rgb(' + parseInt(value) + ',' + parseInt(value) + ',' + parseInt(value) + ')'
			
			// for SVG elements
			if (p == 'r')
				return this.node.r.baseVal.value = value
			
			
			if (/scroll/.test(p))
				return this.node[p] = Math.round(value)
			
			if (p == "opacity")
				return this.node.style[p] = value
			
			if ((p == 'width' || p == 'height') && value < 0)
				value = 0
			
			if (this.unit == 'em')
				return this.node.style[p] = Math.round(value * 100) / 100 + this.unit
			
			return this.node.style[p] = Math.round(value) + this.unit
		}
		catch (ex)
		{
			log(ex + p + value)
			return value
		}
	}
}

PA.addTimer = function (func)
{
	if (!this.timer)
	{
		var t = this
		this.timer = setInterval(function (d) { t.time(d) }, 1000 / this.fps)
	}
	
	return this.timers.push(func)
}

PA.removeTimer = function (num)
{
	var ts = this.timers
	ts[num-1] = null
	
	while (ts[ts.length-1] === null)
		ts.length--
	
	if (!ts.length)
		clearInterval(this.timer), this.timer = null
}

PA.timers = []

PA.time = function (d)
{
	for (var i = 0; i < this.timers.length; i++)
		this.timers[i] && this.timers[i](d)
}


<!--#include file="AnimationTypes.js" -->

})();

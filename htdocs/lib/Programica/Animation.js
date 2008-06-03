

Programica.Animation = function (prms)
{
	prms = prms || {}
	
	// defaults
	this.trans	= []
	this.duration			= prms.duration || 1,
	this.unit				= prms.unit != null ? prms.unit : Programica.Animation.defaults.unit
	this.motion				= prms.motion
	this.running			= false
	this.complete			= false
	this.obj				= prms.obj || false
	this.forceLast			= false
	this.animationTypes		= Programica.Animation.Types
	
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

Programica.Animation.fps = 60
Programica.Animation.defaults = { unit: 'px' }

Programica.Animation.prototype =
{
	start: function ()
	{
		// if animation is already started
		if (this.running)
			return this
		
		// only one animation per node for now
		if (this.obj.animation)
			this.obj.animation.stop()
		this.obj.animation = this
		
		this.running = true
		this.complete = false
		this.frame = 0
		
		this.totalFrames = this.duration * Programica.Animation.fps
		
		for (var i = 0; i < this.trans.length; i++)
		{
			var t = this.trans[i]
			if (t.begin == null) t.begin = this.getStyleProperty(t.property)
			t.step = ( t.end - t.begin ) / this.totalFrames
		}
		
		var o = this
		this.timer = Programica.Animation.addTimer( function () { o.step() } )
		
		this.onstart()
		
		return this
	},

	stop: function ()
	{
		if (this.running)
		{
			this.obj.animation = null
			this.running = false
			Programica.Animation.removeTimer(this.timer)
		}
		
		return this
	},
	
	step: function ()
	{
		if (this.motion == this.animationTypes.directJump)
			this.forceLast = true,
			this.frame = this.totalFrames - 1
		
		this.render()
		this.onstep()
		
		if (this.frame >= this.totalFrames - 1)
		{
			this.stop()
			this.complete = true
			this.oncomplete()
		}
		
		this.frame++
		return this
	},
	
	render: function ()
	{
		if (!this.motion)
			return
		
		if (this.forceLast && this.frame == this.totalFrames - 1)
			for (var i = 0; i < this.trans.length; i++)
			{
				var t = this.trans[i]
				this.setStyleProperty(t.property, t.end)
			}
		else
			for (var i = 0; i < this.trans.length; i++)
			{
				var t = this.trans[i]
				if ( t.property != null && t.begin != null && t.end != null  )
					this.setStyleProperty
					(
						t.property,
						this.motion
						(
							this.frame + 1,
							t.begin,
							t.end - t.begin,
							this.totalFrames
						)
					)
				else throw new Error("Corupted transformation: " + t)
			}
		
		return true
	},
	
	getStyleProperty: function (p)
	{
		if (p == "top" && !this.obj.style[p])
			return this.obj.offsetTop
		
		if (p == "left" && !this.obj.style[p])
			return this.obj.offsetLeft
		
		
		if (p == "opacity" && isNaN(parseFloat(this.obj.style[p])))
			return 1
		
		
		if (/scroll/.test(p))
			return this.obj[p]
		
		return parseFloat(this.obj.style[p]) || 0
	},
	
	setStyleProperty: function (p, value)
	{
		log3("setStyleProperty(" + p + "," + value + ")")
		try
		{
			if (/color/.test(p))
				return this.obj.style[p] = 'rgb(' + parseInt(value) + ',' + parseInt(value) + ',' + parseInt(value) + ')'
			
			// for SVG elements
			if (p == 'r')
				return this.obj.r.baseVal.value = value
			
			
			if (/scroll/.test(p))
				return this.obj[p] = Math.round(value)
			
			if (p == "opacity")
				return this.obj.style[p] = value
			
			if ((p == 'width' || p == 'height') && value < 0)
				value = 0
			
			if (this.unit == 'em')
				return this.obj.style[p] = Math.round(value * 100) / 100 + this.unit
			
			return this.obj.style[p] = Math.round(value) + this.unit
		}
		catch (ex)
		{
			log(ex + p + value)
			return value
		}
	}
}

Programica.Animation.addTimer = function (func)
{
	if (!this.timer)
	{
		var t = this
		this.timer = setInterval (function () { t.time() }, 1000 / this.fps)
	}
	
	return this.timers.push(func)
}

Programica.Animation.removeTimer = function (num)
{
	var ts = this.timers
	ts[num-1] = null
	
	while (ts[ts.length-1] === null)
		ts.length--
	
	if (!ts.length)
		clearInterval(this.timer), this.timer = null
}

Programica.Animation.timers = []

Programica.Animation.time = function ()
{
	for (var i = 0; i < this.timers.length; i++)
		this.timers[i] && this.timers[i]()
}


<!--#include file="AnimationTypes.js" -->

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
	return new Programica.Animation({obj: this, motion: motion, duration: duration, trans: trans, unit: unit}).start()
}



Programica.Animation = function (prms)
{
	// Входные параметры
	prms = prms || {}
	
	// Дефолтные значения
	this.transformations	= []
	this.timeouts			= []
	this.duration			= prms.duration || 1,
	this.unit				= prms.unit != null ? prms.unit: 'px'
	this.motion				= prms.motion
	this.running			= false
	this.paused				= false
	this.complete			= false
	this.obj				= prms.obj || false
	this.intervals			= {}
	this.timeouts			= {}
	this.pmcEvents			= []
	this.forceLast			= false
	this.animationTypes		= Programica.Animation.Types
	
	switch (this.motion.constructor)
	{
		case String:
			this.motion = this.animationTypes[this.motion] || null
			break
		case Function:
			break
		default:
			this.motion = null
	}
	
	// Трансформации, если заданы
	if (prms.transformations)
		for (var i in prms.transformations)
			if (prms.transformations[i])
				this.setTransformation(prms.transformations[i])
	
	log("new Programica.Animation prms: " + prms)
	log("new Programica.Animation this: " + this)
	
	return this
}

Programica.Animation.fps = 50

//.animate('linearTween', {marginTop: [0,-50]}, 1).start()
HTMLElement.prototype.animate = function (motion, props, duration, unit)
{
	var trans = []
	
	for (var i in props)
	{
		if (props[i].length == 2)
		{
			trans.push
			({
				property:	i,
				begin:		props[i][0],
				end:		props[i][1]
			})
		}
		else
		{
			trans.push
			({
				property:	i,
				begin:		null,
				end:		props[i][0]
			})
		}
	}
	
	return new Programica.Animation
	({
		obj:				this,
		motion:				motion,
		duration:			duration,
		transformations:	trans,
		unit:				unit
	})
}

Programica.Animation.prototype = new Programica.Abstract.EventedObject ()

extend (Programica.Animation.prototype,
{
	start: function (delay)
	{
		// Если анимация уже запущена
		if (this.isRunning() && !this.isPaused())
			return false
		
		this.clearTimeout('start')
		
		if (delay)
		{
			var o = this
			this.setTimeout('start',  function () { o.start() }, delay)
		}
		else
		{
			if (!this.dispatchEvent('beforeStart')) return false
			
			// пока по одной анимации на объект
			if (this.obj.animation) this.obj.animation.stop()
			this.obj.animation = this
			
			log('Programica.Animation.start()')
			
			this.running = true
			this.complete = false
			this.frame = 0
			
			this.totalFrames = this.duration * Programica.Animation.fps
			
			for (var i in this.transformations)
			{
				var t = this.transformations[i]
				if (t.begin == null) t.begin = this.getIntegerStyleProperty(t.property)
				t.step = ( t.end - t.begin ) / this.totalFrames
			}
			
			var o = this
			this.timer = Programica.Animation.addTimer(function () { o.step() })
			
			this.dispatchEvent('start')
		}
		
		return this
	},

	stop: function (delay)
	{
		if (this.isRunning())
		{
			if (delay)
			{
				var o = this
				this.setTimeout('stop', function () { o.stop() }, delay)
			}
			else
			{
				this.obj.animation = null
				this.paused = true
				this.running = false
				Programica.Animation.delTimer(this.timer)
			}
			
			return true
		}
		else
			return false
	},
	
	step: function ()
	{
		if (!this.dispatchEvent('beforeStep')) return false
		
		if (this.motion == this.animationTypes.directJump)
			this.forceLast = true,
			this.frame = this.totalFrames - 1
		
		this.render()
		this.dispatchEvent('step')
		
		if (this.frame >= this.totalFrames - 1)
		{
			this.stop()
			this.paused = false
			this.complete = true
			this.dispatchEvent('complete')
		}
		
		this.frame++
		return this
	},
	
	render: function ()
	{
		if (!this.dispatchEvent('beforeRender')) return false
		
		if (!this.motion) log('Rendering without this.motion')
		
		if (this.forceLast && this.frame == this.totalFrames - 1)
			for (var i in this.transformations)
			{
				var t = this.transformations[i]
				this.setIntegerStyleProperty(t.property, t.end)
			}
		else
			for (var i in this.transformations)
			{
				var t = this.transformations[i]
				if ( t.property != null && t.begin != null && t.end != null  )
					this.setIntegerStyleProperty
					(
						t.property,
						this.motion
						(
							this.frame,
							t.begin,
							t.end - t.begin,
							this.totalFrames - 1
						)
					), log3("OK transformation: " + t)
				else log3("Corupted transformation: " + t)
			}
		
		this.dispatchEvent('afterRender')
		
		return true
	},
	
	getIntegerStyleProperty: function (p)
	{
		if (p == "top" && !this.obj.style[p]) return this.obj.offsetTop
		if (p == "left" && !this.obj.style[p]) return this.obj.offsetLeft
		
		if (/scroll/.test(p))
		{
			return this.obj[p]
		}
		else
			return parseInt( this.obj.style[p] ) || 0
	},
	
	setIntegerStyleProperty: function (stylePropertyName, value)
	{
		log3("setIntegerStyleProperty("+stylePropertyName+","+value+")")
		if (/color/.test(stylePropertyName))
		{
			this.obj.style[ stylePropertyName ] = 'rgb('+parseInt(value)+','+parseInt(value)+','+parseInt(value)+')'
		}
		else if (/scroll/.test(stylePropertyName))
		{
			this.obj[ stylePropertyName ] = Math.round( value )
		}
		/*else if (stylePropertyName == "opacity")
		{
			this.obj.style[ stylePropertyName ] = value
		}
		else if (!this.unit)
		{
			this.obj.style[ stylePropertyName ] = value
		}*/
		else
		{
			this.obj.style[ stylePropertyName ] = Math.round( value ) + this.unit
		}
	},
	
	setTransformation:	function (trans)			{ return this.transformations.push(trans) },
	setDuration:		function (t)				{ this.duration = t },
	isRunning:			function ()					{ return this.running },
	isPaused:			function ()					{ return this.paused }
})

Programica.Animation.addTimer = function (func)
{
	if (!Programica.Animation.timer)
		Programica.Animation.timer = setInterval (Programica.Animation.time, 1000 / Programica.Animation.fps)
	
	return Programica.Animation.timers.push(func)
}

Programica.Animation.delTimer = function (num)
{
	delete Programica.Animation.timers[num - 1]
	
	while (Programica.Animation.timers.length && Programica.Animation.timers[Programica.Animation.timers.length-1] == null)
		Programica.Animation.timers.pop()
	
	if (!Programica.Animation.timers.length)
		clearInterval(Programica.Animation.timer),
		Programica.Animation.timer = null
}

Programica.Animation.timers = []

Programica.Animation.time = function ()
{
	for (var i in Programica.Animation.timers)
	{
		Programica.Animation.timers[i]()
		//try { Programica.Animation.timers[i]() } catch (x) { log3(x) }
	}
}




//——————————————————————————————————————————————————————————————————————————————
// Математика трансформаций

Programica.Animation.Types =
{
	directJump:			function (t, b, c, d)		{ /* заглушка */ },
	linearTween:		function (t, b, c, d)		{ return c*t/d + b },
	easeInQuad:			function (t, b, c, d)		{ return c*(t/=d)*t + b },
	easeOutQuad:		function (t, b, c, d)		{ return -c *(t/=d)*(t-2) + b },
	easeInOutQuad:		function (t, b, c, d)		{ return ((t/=d/2) < 1) ? c/2*t*t + b : -c/2 * ((--t)*(t-2) - 1) + b },
	easeInCubic:		function (t, b, c, d)		{ return c*(t/=d)*t*t + b },
	easeOutCubic:		function (t, b, c, d)		{ return c*((t=t/d-1)*t*t + 1) + b },
	easeInOutCubic:		function (t, b, c, d)		{ return ((t/=d/2) < 1) ? c/2*t*t*t + b : c/2*((t-=2)*t*t + 2) + b },
	easeInQuart:		function (t, b, c, d)		{ return c*(t/=d)*t*t*t + b },
	easeOutQuart:		function (t, b, c, d)		{ return -c * ((t=t/d-1)*t*t*t - 1) + b },
	easeInOutQuart:		function (t, b, c, d)		{ return ((t/=d/2) < 1) ? c/2*t*t*t*t + b : -c/2 * ((t-=2)*t*t*t - 2) + b },
	easeInQuint:		function (t, b, c, d)		{ return c*(t/=d)*t*t*t*t + b },
	easeOutQuint:		function (t, b, c, d)		{ return c*((t=t/d-1)*t*t*t*t + 1) + b },
	easeInOutQuint:		function (t, b, c, d)		{ return ((t/=d/2) < 1) ? c/2*t*t*t*t*t + b : c/2*((t-=2)*t*t*t*t + 2) + b },
	easeInSine:			function (t, b, c, d)		{ return -c * Math.cos(t/d * (Math.PI/2)) + c + b },
	easeOutSine:		function (t, b, c, d)		{ return c * Math.sin(t/d * (Math.PI/2)) + b },
	easeInOutSine:		function (t, b, c, d)		{ return -c/2 * (Math.cos(Math.PI*t/d) - 1) + b },
	easeInExpo:			function (t, b, c, d)		{ return (t==0) ? b : c * Math.pow(2, 10 * (t/d - 1)) + b },
	easeOutExpo:		function (t, b, c, d)		{ return (t==d) ? b+c : c * (-Math.pow(2, -10 * t/d) + 1) + b },
	easeInCirc:			function (t, b, c, d)		{ return -c * (Math.sqrt(1 - (t/=d)*t) - 1) + b },
	easeOutCirc:		function (t, b, c, d)		{ return c * Math.sqrt(1 - (t=t/d-1)*t) + b },
	easeInOutCirc:		function (t, b, c, d)		{ return ((t/=d/2) < 1) ? -c/2 * (Math.sqrt(1 - t*t) - 1) + b : c/2 * (Math.sqrt(1 - (t-=2)*t) + 1) + b },
	easeInBounce:		function (t, b, c, d)		{ return c - Math.easeOutBounce (d-t, 0, c, d) + b },
	
	easeInOutExpo: 		function (t, b, c, d)
	{
		if (t==0) return b
		if (t==d) return b+c
		if ((t/=d/2) < 1) return c/2 * Math.pow(2, 10 * (t - 1)) + b
		return c/2 * (-Math.pow(2, -10 * --t) + 2) + b
	},
	
	easeInElastic: 		function (t, b, c, d, a, p)
	{
		if (t==0) return b
		if ((t/=d)==1) return b+c
		if (!p) p=d*.3
		if (a < Math.abs(c))
		{
			var s = p/4
			a = c
		}
		else 
			var s = p/(2*Math.PI) * Math.asin (c/a)
		
		return -(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )) + b
	},
	
	easeOutElastic: 	function (t, b, c, d, a, p)
	{
		if (t==0) 
			return b
		if ((t/=d)==1) 
			return b + c
		if (!p) p = d*.3
		if (a < Math.abs(c))
		{
			var s = p/4
			a = c
		}
		else 
			var s = p/(2*Math.PI) * Math.asin (c/a)
		
		return a*Math.pow(2,-10*t) * Math.sin( (t*d-s)*(2*Math.PI)/p ) + c + b
	},
	
	easeInOutElastic:	function (t, b, c, d, a, p)
	{
		if (t==0) 
			return b
		if ((t/=d/2)==2) 
			return b + c
		if (!p) p = d*(.3*1.5)
		if (a < Math.abs(c))
		{
			a = c
			var s = p/4
		}
		else 
			var s = p/(2*Math.PI) * Math.asin (c/a)
		
		if (t < 1)
			return -.5*(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )) + b
		else
			return a*Math.pow(2,-10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )*.5 + c + b
	},
	
	easeInBack:		function (t, b, c, d, s)
	{
		if (s == null)
			s = 1.70158
		return c*(t/=d)*t*((s+1)*t - s) + b
	},
	
	easeOutBack:	function (t, b, c, d, s)
	{
		if (s == null) 
			s = 1.70158
		
		return c*((t=t/d-1)*t*((s+1)*t + s) + 1) + b
	},
	
	easeInOutBack:	function (t, b, c, d, s)
	{
		if (s == null) 
			s = 1.70158
		
		if ((t/=d/2) < 1) 
			return c/2*(t*t*(((s*=(1.525))+1)*t - s)) + b
		else
			return c/2*((t-=2)*t*(((s*=(1.525))+1)*t + s) + 2) + b
	},
	
	easeOutBounce:	function (t, b, c, d)
	{
		if ((t/=d) < (1/2.75))
			return c*(7.5625*t*t) + b
		else if (t < (2/2.75))
			return c*(7.5625*(t-=(1.5/2.75))*t + .75) + b
		else if (t < (2.5/2.75))
			return c*(7.5625*(t-=(2.25/2.75))*t + .9375) + b
		else
			return c*(7.5625*(t-=(2.625/2.75))*t + .984375) + b
	},
	
	easeInOutBounce:function (t, b, c, d)
	{
		if (t < d/2) 
			return Math.easeInBounce (t*2, 0, c, d) * .5 + b
		else
			return Math.easeOutBounce (t*2-d, 0, c, d) * .5 + c*.5 + b
	}
}
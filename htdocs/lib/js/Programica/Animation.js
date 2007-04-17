

Programica.Animation = function (prms)
{
	// Входные параметры
	prms = prms || {}
	
	// Дефолтные значения
	this.transformations	= []
	this.timeouts			= []
	this.duration			= prms.duration || 1,
	this.unit				= prms.unit != null ? prms.unit: 'px'
	this.motion				= prms.motion || false
	this.running			= false
	this.paused				= false
	this.complete			= false
	this.obj				= prms.obj || false
	this.intervals			= {}
	this.timeouts			= {}
	this.pmcEvents			= []
	
	// Трансформации, если заданы
	if (prms.transformations)
		for (var i in prms.transformations)
			if (prms.transformations[i])
				this.setTransformation(prms.transformations[i])
	
	if (isDebug >= 1) log("new Programica.Animation prms: " + prms)
	if (isDebug >= 1) log("new Programica.Animation this: " + this)
	
	return this
}

Programica.Animation.fps = 50


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
			//this.setInterval('step', function () { o.step() }, (1000 / this.fps))
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
				//this.clearInterval('step')
			}
			
			return true
		}
		else
			return false
	},
	
	step: function ()
	{
		if (!this.dispatchEvent('beforeStep')) return false
		
		// сначала frame++ а потом render(),
		// в нулевом кадре мы и без того отрисованы еще до анимации
		this.frame++
		this.render()
		
		this.dispatchEvent('step')
		
		if (this.frame > this.totalFrames)
		{
			this.stop()
			this.paused = false
			this.complete = true
			this.dispatchEvent('complete')
		}
		
		return this
	},
	
	render: function ()
	{
		if (!this.dispatchEvent('beforeRender')) return false
		
		if (this.frame == this.totalFrames)
			this.setIntegerStyleProperty(this.property, this.end)
		else
			for (var i in this.transformations)
			{
				var t = this.transformations[i]
				if ( t.property != null && t.begin != null && t.end != null && (t.motion || this.motion) )
					this.setIntegerStyleProperty
					(
						t.property,
						Math[t.motion || this.motion]
						(
							this.frame,
							t.begin,
							t.end - t.begin,
							this.totalFrames
						)
					), (isDebug >= 3) && log("OK transformation: " + t)
				else if (isDebug >= 3) log("Corupted transformation: " + t)
			}
		
		this.dispatchEvent('afterRender')
		
		return true
	},
	
	getIntegerStyleProperty: function (stylePropertyName)
	{
		return parseInt( this.obj.style[ stylePropertyName ] )
	},
	
	setIntegerStyleProperty: function (stylePropertyName, value)
	{
		//log("setIntegerStyleProperty("+stylePropertyName+","+value+")")
		if (/color/.test(stylePropertyName))
		{
			this.obj.style[ stylePropertyName ] = 'rgb('+parseInt(value)+','+parseInt(value)+','+parseInt(value)+')'
		}
		else if (stylePropertyName == "opacity")
		{
			this.obj.style[ stylePropertyName ] = value
		}
		else if (!this.unit)
		{
			this.obj.style[ stylePropertyName ] = value
		}
		else
		{
			this.obj.style[ stylePropertyName ] = Math.round( value ) + this.unit
		}
	},
	
	setTransformation:	function (trans)			{ return this.transformations.push(trans) },
	setDuration:		function (t)				{ this.duration = t },
	setSpeed:			function (speed)			{ this.speed = speed },
	setUnit:			function (u)				{ this.unit = u },
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
		try
		{
			Programica.Animation.timers[i]()
		}
		catch (x) {if (isDebug >= 3) throw x}
	}
}




//——————————————————————————————————————————————————————————————————————————————
// Математика трансформаций


Math.linearTween	=	function(t, b, c, d)		{ return c*t/d + b }
Math.easeInQuad		=	function(t, b, c, d)		{ return c*(t/=d)*t + b }
Math.easeOutQuad	=	function(t, b, c, d)		{ return -c *(t/=d)*(t-2) + b }
Math.easeInOutQuad	=	function (t, b, c, d)		{ return ((t/=d/2) < 1) ? c/2*t*t + b : -c/2 * ((--t)*(t-2) - 1) + b }
Math.easeInCubic	=	function (t, b, c, d)		{ return c*(t/=d)*t*t + b }
Math.easeOutCubic	=	function (t, b, c, d)		{ return c*((t=t/d-1)*t*t + 1) + b }
Math.easeInOutCubic	=	function (t, b, c, d)		{ return ((t/=d/2) < 1) ? c/2*t*t*t + b : c/2*((t-=2)*t*t + 2) + b }
Math.easeInQuart	=	function (t, b, c, d)		{ return c*(t/=d)*t*t*t + b }
Math.easeOutQuart	=	function (t, b, c, d)		{ return -c * ((t=t/d-1)*t*t*t - 1) + b }
Math.easeInOutQuart	=	function (t, b, c, d)		{ return ((t/=d/2) < 1) ? c/2*t*t*t*t + b : -c/2 * ((t-=2)*t*t*t - 2) + b }
Math.easeInQuint	=	function (t, b, c, d)		{ return c*(t/=d)*t*t*t*t + b }
Math.easeOutQuint	=	function (t, b, c, d)		{ return c*((t=t/d-1)*t*t*t*t + 1) + b }
Math.easeInOutQuint	=	function (t, b, c, d)		{ return ((t/=d/2) < 1) ? c/2*t*t*t*t*t + b : c/2*((t-=2)*t*t*t*t + 2) + b }
Math.easeInSine		=	function (t, b, c, d)		{ return -c * Math.cos(t/d * (Math.PI/2)) + c + b }
Math.easeOutSine	=	function (t, b, c, d)		{ return c * Math.sin(t/d * (Math.PI/2)) + b }
Math.easeInOutSine	=	function (t, b, c, d)		{ return -c/2 * (Math.cos(Math.PI*t/d) - 1) + b }
Math.easeInExpo		=	function (t, b, c, d)		{ return (t==0) ? b : c * Math.pow(2, 10 * (t/d - 1)) + b }
Math.easeOutExpo	=	function (t, b, c, d)		{ return (t==d) ? b+c : c * (-Math.pow(2, -10 * t/d) + 1) + b }
Math.easeInCirc		=	function (t, b, c, d)		{ return -c * (Math.sqrt(1 - (t/=d)*t) - 1) + b }
Math.easeOutCirc	=	function (t, b, c, d)		{ return c * Math.sqrt(1 - (t=t/d-1)*t) + b }
Math.easeInOutCirc	=	function (t, b, c, d)		{ return ((t/=d/2) < 1) ? -c/2 * (Math.sqrt(1 - t*t) - 1) + b : c/2 * (Math.sqrt(1 - (t-=2)*t) + 1) + b }
Math.easeInBounce	=	function (t, b, c, d)		{ return c - Math.easeOutBounce (d-t, 0, c, d) + b }

Math.easeInOutExpo = function (t, b, c, d)
{
	if (t==0) return b
	if (t==d) return b+c
	if ((t/=d/2) < 1) return c/2 * Math.pow(2, 10 * (t - 1)) + b
	return c/2 * (-Math.pow(2, -10 * --t) + 2) + b
}

Math.easeInElastic = function (t, b, c, d, a, p)
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
}

Math.easeOutElastic = function (t, b, c, d, a, p)
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
}

Math.easeInOutElastic = function (t, b, c, d, a, p)
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
}

Math.easeInBack = function (t, b, c, d, s)
{
	if (s == null)
		s = 1.70158
	return c*(t/=d)*t*((s+1)*t - s) + b
}

Math.easeOutBack = function (t, b, c, d, s)
{
	if (s == null) 
		s = 1.70158
	
	return c*((t=t/d-1)*t*((s+1)*t + s) + 1) + b
}

Math.easeInOutBack = function (t, b, c, d, s)
{
	if (s == null) 
		s = 1.70158
	
	if ((t/=d/2) < 1) 
		return c/2*(t*t*(((s*=(1.525))+1)*t - s)) + b
	else
		return c/2*((t-=2)*t*(((s*=(1.525))+1)*t + s) + 2) + b
}

Math.easeOutBounce = function (t, b, c, d)
{
	if ((t/=d) < (1/2.75))
		return c*(7.5625*t*t) + b
	else if (t < (2/2.75))
		return c*(7.5625*(t-=(1.5/2.75))*t + .75) + b
	else if (t < (2.5/2.75))
		return c*(7.5625*(t-=(2.25/2.75))*t + .9375) + b
	else
		return c*(7.5625*(t-=(2.625/2.75))*t + .984375) + b
}

Math.easeInOutBounce = function (t, b, c, d)
{
	if (t < d/2) 
		return Math.easeInBounce (t*2, 0, c, d) * .5 + b
	else
		return Math.easeOutBounce (t*2-d, 0, c, d) * .5 + c*.5 + b
}
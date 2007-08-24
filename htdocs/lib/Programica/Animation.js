

Programica.Animation = function (prms)
{
	// Входные параметры
	prms = prms || {}
	
	// Дефолтные значения
	this.transformations	= []
	this.duration			= prms.duration || 1,
	this.unit				= prms.unit != null ? prms.unit : Programica.Animation.defaults.unit
	this.motion				= prms.motion
	this.running			= false
	this.paused				= false
	this.complete			= false
	this.obj				= prms.obj || false
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
	
	log2("new Programica.Animation prms: " + prms)
	log2("new Programica.Animation this: " + this)
	
	return this
}

Programica.Animation.fps = 60
Programica.Animation.defaults = { unit: 'px' }

//.animate('linearTween', {marginTop: [0,-50]}, 1).start()
Element.prototype.animate = function (motion, props, duration, unit)
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
				end:		props[i][0] || props[i]
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

if (!window.Programica.Abstract) Programica.Abstract = {}
Programica.Abstract.Events = function () {  }

Programica.Animation.prototype = new Programica.Abstract.Events ()

extend (Programica.Animation.prototype,
{
	start: function ()
	{
		// Если анимация уже запущена
		if (this.isRunning() && !this.isPaused())
			return false
		
		if (!this.dispatchEvent('beforeStart')) return false
		
		// пока по одной анимации на объект
		if (this.obj.animation) this.obj.animation.stop()
		this.obj.animation = this
		
		log2('Programica.Animation.start()')
		
		this.running = true
		this.complete = false
		this.frame = 0
		
		this.totalFrames = this.duration * Programica.Animation.fps
		
		for (var i in this.transformations)
		{
			var t = this.transformations[i]
			if (t.begin == null) t.begin = this.getStyleProperty(t.property)
			t.step = ( t.end - t.begin ) / this.totalFrames
		}
		
		var o = this
		this.timer = Programica.Animation.addTimer( function () { o.step() } )
		
		this.dispatchEvent('start')
		
		return this
	},

	stop: function ()
	{
		if (this.isRunning())
		{
			this.obj.animation = null
			this.paused = true
			this.running = false
			Programica.Animation.delTimer(this.timer)
		}
		
		return this
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
				this.setStyleProperty(t.property, t.end)
			}
		else
			for (var i in this.transformations)
			{
				var t = this.transformations[i]
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
					), log3("OK transformation: " + t)
				else log3("Corupted transformation: " + t)
			}
		
		this.dispatchEvent('afterRender')
		
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
	},
	
	setTransformation:	function (trans)			{ return this.transformations.push(trans) },
	setDuration:		function (t)				{ this.duration = t },
	isRunning:			function ()					{ return this.running },
	isPaused:			function ()					{ return this.paused }
})

Programica.Animation.addTimer = function (func)
{
	if (!this.timer)
	{
		var t = this
		this.timer = setInterval (function () { t.time() }, 1000 / this.fps)
	}
	
	return this.timers.push(func)
}

Programica.Animation.delTimer = function (num)
{
	delete this.timers[num - 1]
	
	while (this.timers.length && this.timers[this.timers.length-1] == null)
		this.timers.pop()
	
	if (!this.timers.length)
		clearInterval(this.timer),
		this.timer = null
}

Programica.Animation.timers = []

Programica.Animation.time = function ()
{
	for (var i in this.timers)
		this.timers[i]()
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


//——————————————————————————————————————————————————————————————————————————————
// Простая событийная модель

with (Programica.Abstract.Events.Event = function () {})
{
	prototype.stopPropogation = function () { return this.cancelBubble = true }
}

// событийная модель
extend (Programica.Abstract.Events.prototype,
{
	// распространяем событие
	dispatchEvent: function (eventName)
	{
		if (this['on' + eventName]) this['on' + eventName].call(this, eventName)
		
		if (this.pmcEvents && this.pmcEvents[eventName])
			for (var i in this.pmcEvents[eventName])
				if (this.pmcEvents[eventName][i])
				{
					if (this.cancelBubble) return true
					this.pmcEvents[eventName][i].call(this, eventName)
				}
		
		return true
	},
	
	// сейчас параметр capture везде всего лишь декорация
	
	// добавляем обработчик
	addEventListener: function (eventName, handler, capture)
	{
		if (this.searchEventListenerIndex(eventName, handler, capture) >= 0) return handler
		
		if (this.pmcEvents[eventName])
			this.pmcEvents[eventName].push(handler)
		else
			this.pmcEvents[eventName] = [handler]
		
		return handler
	},
	
	// ищем индекс обработчика
	searchEventListenerIndex: function (eventName, handler, capture)
	{
		if (this.pmcEvents[eventName])
			for (var i in this.pmcEvents[eventName])
				if (this.pmcEvents[eventName][i] == handler)
					return i
		
		return -1
	},
	
	// ищем функцию обработчика
	searchEventListener: function (eventName, handler, capture)
	{
		var n = this.searchEventListenerIndex(eventName, handler, capture)
		if (n < 0) return null
		
		return this.pmcEvents[eventName][n]
	},
	
	// удаляем обработчик
	removeEventListener: function (eventName, handler, capture)
	{
		var n = this.searchEventListenerIndex(eventName, handler, capture)
		if (n < 0) return false
		
		delete this.pmcEvents[eventName][n]
		return false
	}
})


log2("Programica/Animation.js loaded")
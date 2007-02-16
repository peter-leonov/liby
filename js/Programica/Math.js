
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

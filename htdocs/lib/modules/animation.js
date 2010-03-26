;(function () {

var M = Motion, myName = 'Animation'

function Me (node, motion, duration, trans, unit)
{
	this.node = node
	switch (typeof motion)
	{
		case 'string':
			var name = motion
			if (!(motion = M.types[name]))
				throw new Error('Unknown motion type name "' + name + '"')
			break
		case 'function':
			break
		default:
			throw new Error('Motion type must be a string or a function, got "' + typeof motion + '"')
	}
	this.motion = motion
	this.duration = duration
	this.trans = trans
	this.unit = unit
	this.running = false
	this.completed = 0
	this.motions = []
	
	var me = this
	function complete () { me.complete() }
	for (var i = 0; i < trans.length; i++)
	{
		var tr = trans[i]
		function bakeStep (tr)
		{
			return function (value)
			{
				Me.setStyleProperty(node, tr.property, value, unit)
			}
		}
		this.motions[i] = new M(tr.begin, tr.end, duration, motion, bakeStep(tr), complete)
	}
	
}

Me.defaults = {unit: 'px', motion: 'linearTween', duration: 1}

Element.prototype.animate = function (motion, props, duration, unit)
{
	var defaults = Me.defaults
	if (!motion)
		motion = defaults.motion
	if (!duration)
		duration = defaults.duration
	if (!unit)
		unit = defaults.unit
	
	var trans = []
	for (var k in props)
	{
		var prop = props[k]
		if (prop.length == 2)
			trans.push({property: k, begin: prop[0], end: prop[1]})
		else
			trans.push({property: k, begin: Me.getStyleProperty(this, k), end: prop[0] || prop})
	}
	return new Me(this, motion, duration, trans, unit).start()
}


Me.prototype =
{
	oncomplete: function () {},
	start: function ()
	{
		if (!this.running)
		{
			this.running = true
			
			var motions = this.motions
			for (var i = 0; i < motions.length; i++)
				motions[i].start()
		}
		return this
	},
	
	stop: function ()
	{
		if (this.running)
		{
			this.running = false
			
			var motions = this.motions
			for (var i = 0; i < motions.length; i++)
				motions[i].stop()
		}
		return this
	},
	
	complete: function ()
	{
		if (++this.completed >= this.motions.length)
			this.oncomplete()
	}
}

Me.getStyleProperty = function (node, p)
{
	if (p == "top" && !node.style[p])
		return node.offsetTop
	
	if (p == "left" && !node.style[p])
		return node.offsetLeft
	
	
	if (p == "opacity" && isNaN(parseFloat(node.style[p])))
		return 1
	
	
	if (/scroll/.test(p))
		return node[p]
	
	return parseFloat(node.style[p]) || 0
},

Me.setStyleProperty = function (node, p, value, unit)
{
	try
	{
		if (/color/.test(p))
			return node.style[p] = 'rgb(' + parseInt(value) + ',' + parseInt(value) + ',' + parseInt(value) + ')'
		
		// for SVG elements
		if (p == 'r')
			return node.r.baseVal.value = value
		
		
		if (/scroll/.test(p))
			return node[p] = Math.round(value)
		
		if (p == 'opacity')
			return node.style[p] = value
		
		if ((p == 'width' || p == 'height') && value < 0)
			value = 0
		
		if (unit == 'em')
			return node.style[p] = Math.round(value * 100) / 100 + unit
		
		return node.style[p] = Math.round(value) + unit
	}
	catch (ex)
	{
		log('setStyleProperty(' + arguments +'): ' + ex)
		return value
	}
}

self[myName] = Me

})();

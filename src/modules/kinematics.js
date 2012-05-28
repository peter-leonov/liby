;(function(){

function Kinematics () {}
Kinematics.className = 'Kinematics'
self[Kinematics.className] = Kinematics

var fps = Kinematics.fps = GlobalTimer.fps

function stub () {}

function Space ()
{
	this.timers = {}
	this.ticks = 0
	this.freeze = 0
	this.points = []
	this.forces = []
}

Space.prototype =
{
	minPulse: 1 / (fps * fps *10),
	maxFreeze: fps, // wait one second before freeze
	
	ontick: stub,
	ontimeout: stub,
	onfreeze: stub,
	
	run: function (timeout)
	{
		var me = this
		clearTimeout(this.timers.timeout)
		if (timeout)
			this.timers.timeout = window.setTimeout(function (d) { me.timeout(d) }, timeout)
		
		if (this.running)
			return
		this.running = true
		
		this.freeze = 0
		
		this.timers.tick = GlobalTimer.add(function (d) { me.tick(d) })
	},
	
	timeout: function (d)
	{
		this.ontimeout()
		this.stop()
	},
	
	stop: function ()
	{
		if (!this.running)
			return
		this.running = false
		
		clearTimeout(this.timers.timeout)
		GlobalTimer.remove(this.timers.tick)
	},
	
	tick: function (d)
	{
		this.ticks++
		
		var forces = this.forces, points = this.points
		for (var i = 0, il = forces.length; i < il; i++)
		{
			var force = forces[i]
			for (var j = 0, jl = points.length; j < jl; j++)
				force.apply(points[j])
		}
		
		this.ontick()
		
		var pulse = 0
		for (var i = 0, il = points.length; i < il; i++)
		{
			var p = points[i], v = p.v
			p.x += v.x
			p.y += v.y
		}
		
		for (var i = 0, il = points.length; i < il; i++)
		{
			var v = points[i].v
			pulse += v.x * v.x + v.y * v.y
		}
		
		if (!pulse || pulse < this.minPulse)
		{
			if (++this.freeze == this.maxFreeze)
			{
				this.freeze = 0
				if (this.onfreeze() !== false)
					this.stop()
			}
		}
		else
			this.freeze = 0
		
		this.pulse = pulse
	},
	
	add: function (object)
	{
		if (object instanceof Force)
			this.forces.push(object)
		else if (object instanceof Point)
			this.points.push(object)
		else
			throw new Error('unknown object added ' + object)
		
		return object
	}
}

Space.className = 'Space'
Kinematics[Space.className] = Space


function Point (x, y, vx, vy, m)
{
	this.x = x || 0
	this.y = y || 0
	this.m = m || 1
	this.v = new Vector(vx ? vx / fps : 0, vy ? vy / fps : 0)
}

Point.prototype =
{
	
}

Point.className = 'Point'
Kinematics[Point.className] = Point


function Force () {}

Force.prototype =
{
	apply: function () {}
}

Force.className = 'Force'
Kinematics[Force.className] = Force



function Friction (mu)
{
	this.mu = mu / fps
}

Friction.prototype = new Force()
Friction.prototype.apply = function (point)
{
	point.v.addC(-this.mu)
}

Friction.className = 'Friction'
Kinematics[Friction.className] = Friction



function Wave (step, soft, min)
{
	this.setup(step, soft, min)
}

Wave.prototype = new Force()
Wave.prototype.setup = function (step, soft, min, max)
{
	this.step = step
	this.soft = soft || 10
	this.min = min / fps || 0
	this.max = max / fps || 500
}
Wave.prototype.apply = function (point)
{
	var x = Math.round(point.x), step = this.step,
		pos = x % step,
		shift = x < 0 ? step + pos : pos,
		dir = shift > step / 2 ? shift - step : shift,
		sign = dir < 0 ? 1 : -1,
		v = Math.sqrt(Math.abs(dir)) / this.soft
	
	if (v < this.min)
		v = this.min
	else if (v > this.max)
		v = this.max
	
	if (dir)
		point.v.addX(sign * v)
}

Wave.className = 'Wave'
Kinematics[Wave.className] = Wave



function Vector (x, y)
{
	this.x = x
	this.y = y
	this.h = -1
}

Vector.prototype =
{
	set: function (x, y)
	{
		this.x = x
		this.y = y
		this.h = -1
	},
	
	addX: function (x)
	{
		this.x += x
		this.h = -1
	},
	
	add: function (x, y)
	{
		this.x += x
		this.y += y
		this.h = -1
	},
	
	addC: function (c)
	{
		var x = this.x, y = this.y
		
		var h = this.h
		if (h === -1)
			h = this.h = Math.sqrt(x * x + y * y)
		
		if (h === 0)
			return
		
		var cos = x / h,
			sin = y / h
		
		h += c
		
		if (h > 0)
		{
			this.x = h * cos
			this.y = h * sin
			this.h = h
		}
		else
		{
			this.x = 0
			this.y = 0
			this.h = 0
		}
	}
}

Vector.className = 'Vector'
self[Vector.className] = Vector


})();
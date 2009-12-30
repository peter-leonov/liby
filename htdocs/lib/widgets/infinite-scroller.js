;(function(){

var myName = 'InfiniteScroller'

function Me ()
{
	this.nodes = {}
}

Me.prototype =
{
	friction: 100,
	power: 1.5,
	
	bind: function (root, width)
	{
		this.nodes.root = root
		this.globalX = root.scrollLeft
		this.width = width !== undefined ? width : root.scrollWidth - root.clientWidth
		
		var moveable = this.moveable = new Moveable().bind(root)
		moveable.softStart = true
		
		var me = this
		moveable.addEventListener('moveabout', function (e) { me.onmoveabout(e) }, false)
		moveable.addEventListener('movestart', function (e) { me.onmovestart(e) }, false)
		moveable.addEventListener('move', function (e) { me.onmoving(e) }, false)
		moveable.addEventListener('moveend', function (e) { me.onmoveend(e) }, false)
		
		this.setX = function (x)
		{
			me.globalX = x
			var w = me.width
			root.scrollLeft = x < 0 ? w + x % w : x % w
		}
		// this.setY = function (v) { root.scrollTop = v }
		
		
		var space = this.space = new Kinematics.Space()
		space.add(new Kinematics.Friction(this.friction))
		
		var point = this.point = new Kinematics.Point(0, 0, 0, 0)
		space.add(point)
		
		space.ontick = function () { me.spaceTick() }
		
		return this
	},
	
	spaceTick: function ()
	{
		this.setX(this.point.x)
	},
	
	onmovestart: function (e)
	{
		this.space.stop()
		this.startX = this.globalX
	},
	
	onmoveabout: function ()
	{
		if (this.space.running)
		{
			Moveable.dropClick()
			this.space.stop()
		}
	},
	
	onmoving: function (e)
	{
		this.setX(this.startX - e.data.dx)
	},
	
	onmoveend: function (e)
	{
		var ms = e.data.movements.reverse()
		
		if (ms[5]) // got at least five movements
		{
			
			var root = this.nodes.root,
				// approximating last movements
				vx = ((ms[1].dx - ms[0].dx) + (ms[2].dx - ms[1].dx) + (ms[3].dx - ms[2].dx)) / 3// + (ms[4].dx - ms[3].dx) + (ms[5].dx - ms[4].dx)) / 5
			
			if (vx)
			{
				this.point.x = this.globalX
				this.point.v.set(vx * this.power, 0)
				this.space.run(10000) // set a reasonable timeout
			}
		}
	}
}

Me.className = myName
self[myName] = Me

})();
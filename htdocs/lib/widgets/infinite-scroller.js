;(function(){

var myName = 'InfiniteScroller'

function Me ()
{
	this.nodes = {}
}

Me.prototype =
{
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
		
		this.onMotionStop = function () { me.motionStoped = true }
		
		return this
	},
	
	onmovestart: function (e)
	{
		if (this.motion)
			this.motion.stop()
		this.startX = this.globalX
	},
	
	onmoveabout: function ()
	{
		if (!this.motionStoped)
		{
			Moveable.dropClick()
			if (this.motion)
				this.motion.stop()
		}
	},
	
	onmoving: function (e)
	{
		this.setX(this.startX - e.data.dx)
	},
	
	onmoveend: function (e)
	{
		var ms = e.data.movements.reverse(),
			power = 1000
		
		if (ms[5]) // got at least five movements
		{
			
			var root = this.nodes.root,
				sx = this.globalX,
				// approximating last three movements
				vx = ((ms[1].dx - ms[0].dx) + (ms[2].dx - ms[1].dx) + (ms[3].dx - ms[2].dx)) / 3// + (ms[4].dx - ms[3].dx) + (ms[5].dx - ms[4].dx))
			
			if (vx)
			{
				var tx = vx * 50 / power, dx = power * tx * tx
				this.motionStoped = false
				this.motion = new Motion(sx, sx + dx, tx, Motion.types.easeOutQuad, this.setX, this.onMotionStop).start()
			}
		}
	}
}

Class.setup(Me, myName)
self[myName] = Me

})();
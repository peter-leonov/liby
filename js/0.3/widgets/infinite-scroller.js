;(function(){

var myName = 'InfiniteScroller',
	Me = self[myName] = Class(myName)

Me.prototype.extend
({
	initialize: function ()
	{
		this.nodes = {}
	},
	
	bind: function (root)
	{
		this.nodes.root = root
		this.globalX = root.scrollLeft
		this.width = root.scrollWidth - root.clientWidth
		
		var moveable = this.moveable = new Moveable().bind(root)
		moveable.softStart = true
		
		var me = this
		moveable.addEventListener('movestart', function (e) { me.onmovestart(e) }, false)
		moveable.addEventListener('move',  function (e) { me.onmoving(e) }, false)
		moveable.addEventListener('moveend',   function (e) { me.onmoveend(e) }, false)
		
		this.setX = function (x)
		{
			me.globalX = x
			var w = me.width
			root.scrollLeft = x < 0 ? w + x % w : x % w
		}
		// this.setY = function (v) { root.scrollTop = v }
		
		return this
	},
	
	onmovestart: function (e)
	{
		if (this.motion)
			this.motion.stop()
		this.startX = this.globalX
	},
	
	onmoving: function (e)
	{
		this.setX(this.startX - e.data.dx)
	},
	
	onmoveend: function (e)
	{
		var ms = e.data.movements.reverse(),
			power = 1
		
		if (ms[5]) // got at least five movements
		{
			
			var root = this.nodes.root,
				sx = this.globalX,
				// approximating last three movements
				vx = ((ms[1].dx - ms[0].dx) + (ms[2].dx - ms[1].dx) + (ms[3].dx - ms[2].dx) + (ms[4].dx - ms[3].dx) + (ms[5].dx - ms[4].dx)) / 3
			
			if (vx)
			{
				var ix = Math.inertia(vx) * power
				this.motion = new Motion(sx, sx + ix, power, Motion.types.easeOutQuad, this.setX).start()
			}
		}
	}
})

})();
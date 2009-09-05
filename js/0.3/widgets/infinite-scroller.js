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
		
		var draggable = this.draggable = new Draggable().bind(root)
		
		var me = this
		draggable.addEventListener('dragstart', function (e) { me.ondragstart(e) }, false)
		draggable.addEventListener('dragging',  function (e) { me.ondragging(e) }, false)
		draggable.addEventListener('dragend',   function (e) { me.ondragend(e) }, false)
		
		this.motionX = function (v) { root.scrollLeft = v }
		this.motionY = function (v) { root.scrollTop = v }
		
		return this
	},
	
	ondragstart: function (e)
	{
		if (this.motion)
			this.motion.stop()
		this.startX = this.nodes.root.scrollLeft
	},
	
	ondragging: function (e)
	{
		// log(e.data.dx)
		this.nodes.root.scrollLeft = this.startX - e.data.dx
	},
	
	ondragend: function (e)
	{
		var ms = e.data.movements.reverse(),
			inertia = 0.7
		
		if (ms[3]) // got at least three movements
		{
			
			var root = this.nodes.root,
				sx = this.startX - e.data.dx,
				// approximating last three movements
				vx = (ms[1].dx - ms[0].dx) + (ms[2].dx - ms[1].dx) + (ms[3].dx - ms[2].dx)
			
			if (vx)
			{
				var mx = Math.pow(Math.abs(vx), 1.2) * 3 * inertia * (vx < 0 ? -1 : 1)
				this.motion = new Motion(sx, sx + mx, inertia, Motion.types.easeOutQuad, this.motionX).start()
			}
		}
		
		
		
	}
})

})();
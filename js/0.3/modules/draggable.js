;(function(){

var myName = 'Draggable',
	Me = self[myName] = Class(myName)

Me.mixIn(EventTarget)

Me.prototype.extend
({
	initialize: function () {},
	
	bind: function (node)
	{
		this.node = node
		
		var me = this
		this.mousedown = function (e) { me.ondown(e) }
		this.mousemove = function (e) { me.onmove(e) }
		this.mouseup = function (e) { me.onup(e) }
		
		node.addEventListener('mousedown', this.mousedown, true)
		node.addEventListener('selectstart', function (e) { e.preventDefault() }, false)
		
		return this
	},
	
	ondown: function (e)
	{
		e.stopPropagation()
		e.preventDefault()
		
		if (this.dispatchEventData('dragstart', {event: e}))
		{
			this.startX = e.clientX
			this.startY = e.clientY
			this.movements = []
			
			document.addEventListener('mousemove', this.mousemove, true)
			document.addEventListener('mouseup', this.mouseup, true)
		}
	},
	
	onmove: function (e)
	{
		var dx = e.clientX - this.startX,
			dy = e.clientY - this.startY
		
		this.movements.push({dx: dx, dy: dy})
		
		e.stopPropagation()
		e.preventDefault()
		
		if (this.lastDX != dx || this.lastDY != dy)
		{
			this.lastDX = dx
			this.lastDY = dy
			this.dispatchEventData('dragging', {event: e, dx: dx, dy: dy})
		}
	},
	
	onup: function (e)
	{
		var dx = e.clientX - this.startX,
			dy = e.clientY - this.startY
		
		if (this.dispatchEventData('dragend', {event: e, dx: dx, dy: dy, movements: this.movements}))
		{
			e.stopPropagation()
			e.preventDefault()
		
			document.removeEventListener('mousemove', this.mousemove, true)
			document.removeEventListener('mouseup', this.mouseup, true)
		}
	}
})

})();
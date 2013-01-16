;(function(){

function Moveable () {}

function preventDefault (e){ e.preventDefault() }
var dropClick = false
function onclick (e)
{
	if (dropClick)
	{
		e.preventDefault()
		dropClick = false
	}
}
Moveable.dropClick = function () { dropClick = true }

var clickListener = false
Moveable.bindClickListened = function ()
{
	if (clickListener)
		return
	
	document.addEventListener('click', onclick, true)
	clickListener = true
}

Moveable.prototype =
{
	bind: function (node)
	{
		this.node = node
		
		var me = this
		this.mousedown = function (e) { me.ondown(e) }
		this.mousemove = function (e) { me.onmove(e) }
		this.mousemove2 = function (e) { me.onmove2(e) }
		this.mouseup = function (e) { me.onup(e) }
		this.mouseup2 = function (e) { me.onup2(e) }
		
		node.addEventListener('mousedown', this.mousedown, false)
		node.addEventListener('selectstart', preventDefault, false)
		
		Moveable.bindClickListened()
		
		return this
	},
	
	ondown: function (e)
	{
		if (this.disabled)
			return
		
		if (this.dispatchEvent('moveabout', {event: e, mousedownEvent: this.mousedownEvent}))
		{
			this.startX = e.clientX
			this.startY = e.clientY
			this.movements = []
			this.mousedownEvent = e
			
			e.preventDefault()
			
			document.addEventListener('mousemove', this.mousemove, true)
			document.addEventListener('mouseup', this.mouseup, true)
		}
	},
	
	onmove: function (e)
	{
		var dx = e.clientX - this.startX,
			dy = e.clientY - this.startY
		
		this.movements.push({dx: dx, dy: dy})
		
		if (dx * dx > 9 || dy * dy > 9)
		{
			if (this.dispatchEvent('movestart', {event: e, mousedownEvent: this.mousedownEvent}))
			{
				Moveable.dropClick()
				
				if (this.softStart)
				{
					this.startX = e.clientX
					this.startY = e.clientY
				}
				
				document.removeEventListener('mousemove', this.mousemove, true)
				document.removeEventListener('mouseup', this.mouseup, true)
				
				document.addEventListener('mousemove', this.mousemove2, true)
				document.addEventListener('mouseup', this.mouseup2, true)
				
				this.onmove2(e)
			}
		}
		else
			this.dispatchEvent('movestarting', {event: e, mousedownEvent: this.mousedownEvent})
	},
	
	onup: function (e)
	{
		document.removeEventListener('mousemove', this.mousemove, true)
		document.removeEventListener('mouseup', this.mouseup, true)
		this.mousedownEvent = null
	},
	
	onmove2: function (e)
	{
		var dx = e.clientX - this.startX,
			dy = e.clientY - this.startY
		
		this.movements.push({dx: dx, dy: dy})
		
		e.preventDefault()
		e.stopPropagation()
		
		if (this.lastDX != dx || this.lastDY != dy)
		{
			this.lastDX = dx
			this.lastDY = dy
			this.dispatchEvent('move', {event: e, dx: dx, dy: dy})
		}
	},
	
	onup2: function (e)
	{
		var dx = e.clientX - this.startX,
			dy = e.clientY - this.startY
		
		if (this.dispatchEvent('moveend', {event: e, dx: dx, dy: dy, movements: this.movements}))
		{
			e.preventDefault()
			e.stopPropagation()
			
			document.removeEventListener('mousemove', this.mousemove2, true)
			document.removeEventListener('mouseup', this.mouseup2, true)
		}
		
		this.mousedownEvent = null
	}
}

Moveable.mixIn(EventDriven)

self.Moveable = Moveable

})();
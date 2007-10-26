
Programica.Draggable = function (props)
{
	for (var i in props)
		this[i] = props[i]
}

Programica.Draggable.prototype =
{
	start: function (e)
	{
		this.nodeX = this.node.offsetLeft
		this.nodeY = this.node.offsetTop
	},
	move: function (dx, dy, e)
	{
		this.node.style.left = this.nodeX + dx + 'px'
		this.node.style.top = this.nodeY + dy + 'px'
	},
	stop: function (e) {}
}


Programica.Draggable.bind = function (node, props)
{
	var handl = new this(props)
	handl.node = node
	
	var mousemove = function (e)
	{
		var dx = e.clientX - handl.startX
		var dy = e.clientY - handl.startY
		
		e.stopPropagation()
		e.preventDefault()
		
		
		if (handl.lastDX != dx || handl.lastDY != dy)
		{
			handl.lastDX = dx
			handl.lastDY = dy
			handl.move(dx, dy)
		}
	}
	
	var mousedown = function (e)
	{
		if (handl.start(e) !== false)
		{
			handl.startX = e.clientX
			handl.startY = e.clientY
			
			document.addEventListener('mousemove', mousemove, true)
			document.addEventListener('mouseup', mouseup, true)
		}
		
		e.stopPropagation()
		e.preventDefault()
		
		Programica.Draggable.active = handl
	}
	
	var mouseup = function (e)
	{
		document.removeEventListener('mousemove', mousemove, true)
		document.removeEventListener('mouseup', mouseup, true)
		
		e.stopPropagation()
		e.preventDefault()
		
		Programica.Draggable.active = null
	}
	
	node.addEventListener('mousedown', mousedown, false)
	
	return handl
}
;(function(){

var myName = 'Recorder'

function Me () {}

Me.prototype =
{
	shortNames: {mousemove: 'mm', mousedown: 'md', mouseup: 'mu'},
	longNames:  {mm: 'mousemove', md: 'mousedown', mu: 'mouseup'},
	bind: function (doc, body)
	{
		this.doc = doc
		this.cursor = body.appendChild(doc.createElement('div'))
		this.cursor.id = 'recorder-cursor'
	},
	
	addListeners: function ()
	{
		var me = this
		function listener (e) { me.record(e) }
		this.listener = listener
		this.doc.addEventListener('mousemove', listener, true)
		this.doc.addEventListener('mousedown', listener, true)
		this.doc.addEventListener('mouseup', listener, true)
	},
	
	removeListeners: function ()
	{
		var listener = this.listener
		if (!listener)
			return
		
		this.doc.removeEventListener('mousemove', listener, true)
		this.doc.removeEventListener('mousedown', listener, true)
		this.doc.removeEventListener('mouseup', listener, true)
	},
	
	start: function ()
	{
		this.nodes = 0
		this.actions = []
		this.begin = new Date()
		this.addListeners()
	},
	
	stop: function ()
	{
		this.removeListeners()
	},
	
	guesNodePath: function (node)
	{
		var parent, path = []
		while ((parent = node.parentNode))
		{
			var childs = parent.childNodes
			for (var i = 0, num = 0, il = childs.length; i < il; i++)
			{
				var child = childs[i]
				if (child === node)
					break
				// different browsers differ in node traversal support
				// and we have additional scripts for some browsers just in body node
				else if (child.nodeType == 1 && child.nodeName != 'SCRIPT')
					num++
			}
			
			path.push(num)
			node = parent
		}
		
		return path.reverse()
	},
	
	guesNode: function (path)
	{
		var node = document
		
		for (var i = 0, il = path.length; node && i < il; i++)
		{
			var childs = node.childNodes, n = path[i]
			for (var j = 0, num = 0, jl = childs.length; j < jl; j++)
			{
				var child = childs[j]
				if (child.nodeType == 1 && child.nodeName != 'SCRIPT')
					if (num === n)
					{
						node = child
						break
					}
					else
						num++
			}
		}
		return node
	},
	
	record: function (e)
	{
		var action =
		{
			e: this.shortNames[e.type],
			p: [e.clientX, e.clientY],
			t: new Date() - this.begin
		}
		
		var nodeNum, node = e.target
		if (!(nodeNum = node.__Recorder_nodeNum))
		{
			var path = this.guesNodePath(node)
			action.path = path
			nodeNum = node.__Recorder_nodeNum = ++this.nodes
		}
		action.n = nodeNum
		this.actions.push(action)
	},
	
	script: function ()
	{
		this.stop()
		return this.actions
	},
	
	load: function (arr)
	{
		this.actions = arr
	},
	
	play: function ()
	{
		if (!this.actions)
			throw new Error('nothing to playback')
		
		this.cursor.style.display = 'block'
		
		log('playing:', this.actions.length)
		// this.doc.removeEventListener('mousemove', mousemove, false)
		// this.doc.removeEventListener('keypress', keypress, false)
		this.nodes = {}
		this.frame = 0
		this.begin = new Date()
		clearTimeout(this.timer)
		var me = this
		this.callFrame = function () { me.nextFrame() }
		this.timer = setTimeout(this.callFrame, 0)
	},
	
	pause: function ()
	{
		this.cursor.style.display = 'none'
	},
	
	nextFrame: function ()
	{
		var action = this.actions[this.frame++]
		if (!action)
			return this.pause()
		
		var point = action.p, x = point[0], y = point[1]
		// cursor = cursor.cloneNode(false)
		// this.doc.body.appendChild(cursor)
		var style = this.cursor.style
		style.left = x + 'px'
		style.top = y + 'px'
		
		var num = action.n, path = action.path
		if (path)
		{
			node = this.guesNode(path)
			this.nodes[num] = node
		}
		else
			node = this.nodes[num]
		
		if (!node)
			throw new Error('could not determine current node')
		
		var next = action.t - (new Date() - this.begin)
		setTimeout(this.callFrame, next < 0 ? 0 : next)
		
		var e = this.doc.createEvent('MouseEvent')
		e.initMouseEvent(this.longNames[action.e], true, true, window,  0, 0, 0, x, y, false, false, false, false, 0, null)
		node.dispatchEvent(e)
		// this.doc.elementFromPoint(point.x, point.y)
	}
}

self[myName] = Me

})();
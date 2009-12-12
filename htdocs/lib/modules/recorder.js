;(function(){

var myName = 'Recorder'

function Me () {}

Me.prototype =
{
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
	},
	
	removeListeners: function ()
	{
		var listener = this.listener
		this.doc.removeEventListener('mousemove', listener, true)
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
			for (var i = 0, il = childs.length; i < il; i++)
				if (childs[i] === node)
					break
			
			path.push(i)
			node = parent
		}
		
		return path.reverse()
	},
	
	guesNode: function (path)
	{
		var node = document
		
		for (var i = 0, il = path.length; i < il; i++)
			node = node.childNodes[path[i]]
		
		return node
	},
	
	record: function (e)
	{
		var action =
		{
			type: e.type,
			point: {x: e.clientX, y: e.clientY},
			t: new Date() - this.begin
		}
		
		var nodeNum, node = e.target
		
		if (!(nodeNum = node.__Recorder_nodeNum))
		{
			var path = this.guesNodePath(node)
			action.path = path
			nodeNum = node.__Recorder_nodeNum = ++this.nodes
		}
		action.node = nodeNum
		this.actions.push(action)
	},
	
	script: function ()
	{
		return this.actions
	},
	
	play: function ()
	{
		if (!this.actions)
			throw new Error('nothing to playback')
		this.stop()
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
	
	nextFrame: function ()
	{
		var action = this.actions[this.frame++]
		if (action)
		{
			var point = action.point
			// cursor = cursor.cloneNode(false)
			// this.doc.body.appendChild(cursor)
			var style = this.cursor.style
			style.left = point.x + 'px'
			style.top = point.y + 'px'
			var next = action.t - (new Date() - this.begin)
			setTimeout(this.callFrame, next)
			
			var num = action.num, path = action.path
			if (path)
			{
				node = this.guesNode(path)
				this.nodes[num] = node
			}
			else
				node = this.nodes[num]
			
			
			var e = this.doc.createEvent('MouseEvents')
			e.initMouseEvent('mousemove', true, true, window,  0, 0, 0, point.x, point.y, false, false, false, false, 0, null)
			node.dispatchEvent(e)
			// this.doc.elementFromPoint(point.x, point.y)
		}
	}
}

self[myName] = Me

})();
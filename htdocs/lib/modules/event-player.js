;(function(){

var myName = 'EventPlayer'

function Me () {}

Me.prototype =
{
	bind: function (doc, body)
	{
		this.doc = doc || document
		this.body = body || document.body
	},
	
	guesNode: function (path)
	{
		var node = this.doc
		
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
	
	load: function (arr)
	{
		this.actions = arr
	},
	
	play: function ()
	{
		if (!this.actions)
			throw new Error('nothing to playback')
		
		this.state = {}
		this.nodes = {}
		this.frame = 0
		this.begin = new Date()
		clearTimeout(this.timer)
		var me = this
		this.callFrame = function () { me.nextFrame() }
		if (this.onstart && this.onstart() === false)
			return
		this.timer = setTimeout(this.callFrame, 0)
	},
	
	nextFrame: function ()
	{
		var action = this.actions[this.frame++]
		if (!action)
			return this.oncomplete && this.oncomplete()
		
		var state = this.state
		
		var point = action.p, x = point[0], y = point[1]
		
		var num = action.n, path = action.path
		if (path)
		{
			node = this.guesNode(path)
			this.nodes[num] = node
			state.n = num
		}
		else
			node = this.nodes[num || state.n]
		
		if (!node)
			throw new Error('could not determine current node')
		
		if (this.onstep && this.onstep(action, x, y, node) === false)
			return
		
		var next = action.t - (new Date() - this.begin)
		setTimeout(this.callFrame, next < 0 ? 0 : next)
		
		var type = action.e
		if (type)
			state.e = type
		else
			type = state.e
		
		var e = this.doc.createEvent('MouseEvent')
		e.initMouseEvent(type, true, true, window,  0, 0, 0, x, y, false, false, false, false, 0, null)
		node.dispatchEvent(e)
		// this.doc.elementFromPoint(point.x, point.y)
	}
}

self[myName] = Me

})();
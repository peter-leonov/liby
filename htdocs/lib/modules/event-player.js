;(function(){

var myName = 'EventPlayer'

function Me () {}

Me.prototype =
{
	longNames:  {mm: 'mousemove', md: 'mousedown', mu: 'mouseup'},
	bind: function (doc, body)
	{
		this.doc = doc || document
		this.body = body || document.body
		this.cursor = this.body.appendChild(this.doc.createElement('div'))
		this.cursor.id = 'recorder-cursor'
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
		
		this.cursor.style.display = 'block'
		
		// log('playing:', this.actions.length)
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
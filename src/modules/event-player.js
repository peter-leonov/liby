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
		// this.last = new Date()
		window.clearTimeout(this.timer)
		var me = this
		this.callFrame = function () { me.nextFrame() }
		if (this.onstart && this.onstart() === false)
			return
		this.timer = window.setTimeout(this.callFrame, 0)
	},
	
	nextFrame: function ()
	{
		var action
		if ((action = this.nextAction))
			this.processAction(action)
		
		action = this.nextAction = this.actions[this.frame++]
		if (!action)
			return this.oncomplete && this.oncomplete()
		
		var next = action.t// - (new Date() - this.last)
		window.setTimeout(this.callFrame, next <= 0 ? 0 : next)
	},
	
	processAction: function (action)
	{
		var state = this.state
		
		var node, num = action.n, path = action.path
		if (path)
		{
			node = this.doc.getChildByIndexedPath(path)
			this.nodes[num] = node
			state.n = num
		}
		else
			node = this.nodes[num || state.n]
		
		if (!node)
			throw new Error('could not determine current node num=' + num + ', path=' + path)
		
		if (this.onstep && this.onstep(node, action) === false)
			return
		
		var type = action.e
		if (type)
			state.e = type
		else
			type = state.e
		
		var dispatcher = this.typeMap[type]
		if (dispatcher)
			dispatcher.call(this, type, node, action, state)
		else
			throw new Error('could not dispatch event type ' + type + '"')
		
		if (action.next)
			this.processAction(action.next)
	},
	
	dispatchMouse: function (type, node, action, state)
	{
		var point = action.p, x = point[0], y = point[1]
		
		// node = this.doc.elementFromPoint(x, y)
		var e = this.doc.createEvent('MouseEvent')
		e.initMouseEvent(type, true, true, window,  0, 0, 0, x, y, false, false, false, false, 0, null)
		e.__createdByEventPlayer = true
		node.dispatchEvent(e)
	},
	
	dispatchKeyborad: function (type, node, a, state)
	{
		// node = this.doc.elementFromPoint(x, y)
		// var e = this.doc.createEvent('KeyboardEvent')
		// e.initKeyEvent(type, true, true, window, a.ctrlKey, a.altKey, a.shiftKey, a.metaKey, a.keyCode, a.charCode)
		var e = this.doc.createEvent('UIEvent')
		e.initUIEvent(type, true, true, window, 0)
		e.keyCode = a.keyCode
		e.__createdByEventPlayer = true
		node.dispatchEvent(e)
		
		// mimic the browser behavior: set the value precisely after the event dispatch
		if (type == 'keypress' && 'inputValue' in a)
			node.value = a.inputValue
	}
}

var proto = Me.prototype
proto.typeMap =
{
	mousemove: proto.dispatchMouse,
	mousedown: proto.dispatchMouse,
	mouseup: proto.dispatchMouse,
	click: proto.dispatchMouse,
	keydown: proto.dispatchKeyborad,
	keypress: proto.dispatchKeyborad,
	keyup: proto.dispatchKeyborad
}

self[myName] = Me

})();
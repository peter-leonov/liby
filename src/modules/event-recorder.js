;(function(){

var myName = 'EventRecorder'

function Me () {}

Me.prototype =
{
	bind: function (doc)
	{
		this.doc = doc || document
	},
	
	addListeners: function ()
	{
		var me = this
		function listener (e) { me.record(e) }
		this.listener = listener
		
		for (var k in this.typeMap)
			this.doc.addEventListener(k, listener, true)
	},
	
	removeListeners: function ()
	{
		var listener = this.listener
		if (!listener)
			return
		
		for (var k in this.typeMap)
			this.doc.removeEventListener(k, listener, true)
	},
	
	start: function ()
	{
		this.nodes = 0
		this.lastAction = {}
		this.actions = []
		this.state = {}
		this.last = new Date()
		this.addListeners()
	},
	
	stop: function ()
	{
		this.removeListeners()
	},
	
	record: function (e)
	{
		if (e.__createdByEventPlayer)
			return
		
		var state = this.state,
			now = new Date()
		
		var action =
		{
			t: now - this.last
		}
		this.last = now
		
		var type = e.type
		if (state.e !== type)
			state.e = action.e = type
		
		var nodeNum, node = e.target
		if (!(nodeNum = node.__Recorder_nodeNum))
		{
			var path = this.doc.childIndexedPath(node)
			action.path = path
			nodeNum = node.__Recorder_nodeNum = ++this.nodes
		}
		
		if (state.n !== nodeNum)
			state.n = action.n = nodeNum
		
		var recorder = this.typeMap[type]
		if (recorder)
		{
			if (recorder.call(this, type, e, node, action, state) !== false)
				this.actions.push(action)
			this.lastAction = action
		}
		else
			throw new Error('could not record event type ' + type + '"')
	},
	
	recordMouse: function (type, e, node, action, state)
	{
		action.p = [e.clientX, e.clientY]
	},
	
	recordKeyborad: function (type, e, node, action, state)
	{
		action.keyCode = e.keyCode
		if (type == 'keypress' && node.nodeName == 'INPUT' && (node.type == 'text' || !node.type))
		{
			// keypress may occur many times before keyup will
			// so we have to catch input's value after every keypres
			function save ()
			{
				action.inputValue = node.value
			}
			// setting zero timeout could be enough to get the value in time
			window.setTimeout(save, 0)
			
			if (this.lastAction.e == 'keydown')
			{
				this.lastAction.next = action
				return false
			}
		}
	},
	
	script: function ()
	{
		this.stop()
		return this.actions
	}
}

var proto = Me.prototype
proto.typeMap =
{
	mousemove: proto.recordMouse,
	mousedown: proto.recordMouse,
	mouseup: proto.recordMouse,
	click: proto.recordMouse,
	keydown: proto.recordKeyborad,
	keypress: proto.recordKeyborad,
	keyup: proto.recordKeyborad
}


self[myName] = Me

})();
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
		this.doc.addEventListener('mousemove', listener, true)
		this.doc.addEventListener('mousedown', listener, true)
		this.doc.addEventListener('mouseup', listener, true)
		this.doc.addEventListener('click', listener, true)
		this.doc.addEventListener('keydown', listener, true)
	},
	
	removeListeners: function ()
	{
		var listener = this.listener
		if (!listener)
			return
		
		this.doc.removeEventListener('mousemove', listener, true)
		this.doc.removeEventListener('mousedown', listener, true)
		this.doc.removeEventListener('mouseup', listener, true)
		this.doc.removeEventListener('click', listener, true)
		this.doc.removeEventListener('keydown', listener, true)
	},
	
	start: function ()
	{
		this.nodes = 0
		this.actions = []
		this.state = {}
		this.begin = new Date()
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
		
		var state = this.state
		
		var action =
		{
			t: new Date() - this.begin
		}
		
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
			recorder.call(this, type, e, node, action, state)
		else
			throw new Error('could not record event type ' + type + '"')
		
		this.actions.push(action)
	},
	
	recordMouse: function (type, e, node, action, state)
	{
		action.p = [e.clientX, e.clientY]
	},
	
	recordKeyborad: function (type, e, node, action, state)
	{
		var keyCode = e.keyCode
		if (state.keyCode !== keyCode)
		{
			state.keyCode = action.keyCode = keyCode
			state.inputValue = action.inputValue = node.value
			log(node.value)
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
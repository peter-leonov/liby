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
		var state = this.state
		
		var action =
		{
			p: [e.clientX, e.clientY],
			t: new Date() - this.begin
		}
		
		if (state.e !== e.type)
			state.e = action.e = e.type
		
		var nodeNum, node = e.target
		if (!(nodeNum = node.__Recorder_nodeNum))
		{
			var path = this.doc.childIndexedPath(node)
			action.path = path
			nodeNum = node.__Recorder_nodeNum = ++this.nodes
		}
		
		if (state.n !== nodeNum)
			state.n = action.n = nodeNum
		
		this.actions.push(action)
	},
	
	script: function ()
	{
		this.stop()
		return this.actions
	}
}

self[myName] = Me

})();
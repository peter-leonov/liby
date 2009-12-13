;(function(){

var myName = 'EventRecorder'

function Me () {}

Me.prototype =
{
	shortNames: {mousemove: 'mm', mousedown: 'md', mouseup: 'mu'},
	bind: function (doc)
	{
		this.doc = doc
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
	
	
	enableControls: function ()
	{
		var started = false, me = this
		function keydown (e)
		{
			// alert(e.keyCode)
			if (e.keyCode == 82)
			// if (e.ctrlKey && e.charCode == 114)
				if (started)
				{
					started = false
					me.stop()
				}
				else
				{
					started = true
					me.start()
				}
			
			if (e.keyCode == 80)
				me.play()
			
			if (e.keyCode == 83)
				// window.prompt('the script', JSON.stringify(me.script()))
				log(JSON.stringify(me.script()))
		}
		document.addEventListener('keydown', keydown, false)
	}
}

self[myName] = Me

})();
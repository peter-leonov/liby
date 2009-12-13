;(function(){

var myName = 'Recorder'

// eval(NodesShortcut())

function Me (doc, root)
{
	this.doc = doc || document
	this.root = root || document.body
	this.constructor = Me
}

Me.prototype =
{
	enable: function ()
	{
		var me = this
		document.addEventListener('keydown', function (e) { me.keydown(e) }, false)
	},
	
	started: false,
	keydown: function (e)
	{
		// alert(e.keyCode)
		if (e.keyCode == 82)
		// if (e.ctrlKey && e.charCode == 114)
			if (this.recorder)
			{
				this.recorder.stop()
				this.lastRecorder = this.recorder
				this.recorder = null
			}
			else
			{
				var recorder = this.recorder = new EventRecorder()
				recorder.bind(this.doc)
				recorder.start()
			}
		
		if (e.keyCode == 80)
		{
			if (!this.lastRecorder)
				return alert('nothing to play')
			
			var player = new EventPlayer()
			player.bind(this.doc, this.root)
			player.load(this.lastRecorder.script())
			
			var cursor = null
			player.onstart = function ()
			{
				cursor = this.doc.createElement('div')
				cursor.className = 'recorder-cursor'
				this.body.appendChild(cursor)
			}
			
			player.onstep = function (a, x, y)
			{
				var style = cursor.style
				style.left = x + 'px'
				style.top = y + 'px'
			}
			
			player.oncomplete = function ()
			{
				this.body.removeChild(cursor)
			}
			
			player.play()
		}
		
		if (e.keyCode == 83)
		{
			if (!this.lastRecorder)
				return alert('nothing to save')
			
			window.prompt('the script:', JSON.stringify(this.lastRecorder.script()))
		}
	}
}

// Me.mixIn(EventDriven)
Me.className = myName
self[myName] = Me

})();
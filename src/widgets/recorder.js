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
	bind: function ()
	{
		var me = this
		document.addEventListener('keydown', function (e) { me.keydown(e) }, false)
	},
	
	play: function (script)
	{
		this.lastScript = script
		var player = new EventPlayer()
		player.bind(this.doc, this.root)
		player.load(script)
		
		var cursor = null
		player.onstart = function ()
		{
			cursor = this.doc.createElement('div')
			cursor.className = 'recorder-cursor'
			this.body.appendChild(cursor)
		}
		
		player.onstep = function (n, a)
		{
			var p
			if ((p = a.p))
			{
				var style = cursor.style
				style.left = p[0] + 'px'
				style.top = p[1] + 'px'
			}
		}
		
		player.oncomplete = function ()
		{
			this.body.removeChild(cursor)
		}
		
		player.play()
	},
	
	keydown: function (e)
	{
		// alert(e.keyCode)
		if (e.__createdByEventPlayer)
			return
		
		if (!e.altKey)
			return
		
		if (e.keyCode == 82)
		{
			e.preventDefault()
			
			if (this.recorder)
			{
				this.recorder.stop()
				this.lastScript = this.recorder.script()
				this.recorder = null
			}
			else
			{
				var recorder = this.recorder = new EventRecorder()
				recorder.bind(this.doc)
				recorder.start()
			}
		}
		
		if (e.keyCode == 80)
		{
			e.preventDefault()
			
			if (!this.lastScript)
				return alert('nothing to play')
			
			this.play(this.lastScript)
		}
		
		if (e.keyCode == 83)
		{
			e.preventDefault()
			
			if (!this.lastScript)
				return alert('nothing to save')
			
			var script = JSON.stringify(this.lastScript)
			if (e.shiftKey)
				window.name = script
			else
				window.prompt('saving the script:', script)
		}
		
		if (e.keyCode == 76)
		{
			e.preventDefault()
			
			var script
			if (e.shiftKey)
				script = window.name
			else
				script = window.prompt('loading the script:', script)
			
			if (script != null)
			{
				try
				{
					script = JSON.parse(script)
				}
				catch (ex)
				{
					return alert('error parsing script')
				}
				
				this.lastScript = script
			}
		}
	},
	
	playBuffer: function ()
	{
		try
		{
			this.play(JSON.parse(window.name))
		}
		catch (ex) {}
	}
}

// Me.mixIn(EventDriven)
Me.className = myName
self[myName] = Me

})();
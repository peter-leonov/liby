(function(){

// this crazy hack prevents Opera's default drag action somehow
document.addEventListener('mousedown', function () {}, false)

var Me =
{
	states:
	{
		initial: {},
		
		waitForMouseDown:
		{
			enter: function (sm)
			{
				var me = this
				function mousedown (e)
				{
					e.preventDefault()
					
					me.startNode = e.target
					me.startX = e.pageX
					me.startY = e.pageY
					
					document.removeEventListener('mousedown', mousedown, false)
					sm.switchState('waitForMoveFarEnough')
				}
				document.addEventListener('mousedown', mousedown, false)
			}
		},
		
		waitForMoveFarEnough:
		{
			enter: function (sm)
			{
				var me = this
				function mousemove (e)
				{
					if (Math.abs(me.startX - e.pageX) < 4 || Math.abs(me.startY - e.pageY) < 4)
						return
					
					document.removeEventListener('mousemove', mousemove, false)
					document.removeEventListener('mouseup', mouseup, false)
					sm.switchState('startDrag')
				}
				document.addEventListener('mousemove', mousemove, false)
				
				function mouseup (e)
				{
					document.removeEventListener('mousemove', mousemove, false)
					document.removeEventListener('mouseup', mouseup, false)
					sm.switchState('waitForMouseDown')
				}
				document.addEventListener('mouseup', mouseup, false)
			}
		},
		
		startDrag:
		{
			enter: function (sm)
			{
				var ne = document.createEvent('Event')
				ne.initEvent('dragstart', true, true)
				this.dataTransfer = ne.dataTransfer = new DataTransfer()
				this.startNode.dispatchEvent(ne)
				
				function mousemove (e)
				{
					// dragover even emulation here
				}
				document.addEventListener('mousemove', mousemove, false)
				
				var me = this
				function mouseup (e)
				{
					me.stopNode = e.target
					
					document.removeEventListener('mousemove', mousemove, false)
					document.removeEventListener('mouseup', mouseup, false)
					sm.switchState('stopDrag')
				}
				document.addEventListener('mouseup', mouseup, false)
			}
		},
		
		stopDrag:
		{
			enter: function (sm)
			{
				var ne = document.createEvent('Event')
				ne.initEvent('dragend', true, true)
				ne.dataTransfer = this.dataTransfer
				this.startNode.dispatchEvent(ne)
				
				var ne = document.createEvent('Event')
				ne.initEvent('drop', true, true)
				ne.dataTransfer = this.dataTransfer
				this.stopNode.dispatchEvent(ne)
				
				sm.switchState('waitForMouseDown')
			}
		}
	},
	
	bind: function ()
	{
		var sm = this.sm = new StateMachine(this)
		sm.setStates(this.states)
		sm.switchState('waitForMouseDown')
	}
}

Me.bind()

function DataTransfer ()
{
	this.data = {}
}

DataTransfer.prototype =
{
	setData: function (k, v)
	{
		this.data[k] = v
	},
	
	getData: function (k)
	{
		return this.data[k]
	}
}

})();

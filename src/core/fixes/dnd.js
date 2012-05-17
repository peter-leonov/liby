(function(){

// this crazy hack prevents Opera's default drag action somehow
document.addEventListener('mousedown', function () {}, false)

var Me =
{
	states: function (sm)
	{
		var states = {}
		
		var me = this
		
		;(function(){
		
		function mousedown (e)
		{
			e.preventDefault()
			
			me.startNode = e.target
			me.startX = e.pageX
			me.startY = e.pageY
			
			sm.switchState('waitForMoveFarEnough')
		}
		
		states.waitForMouseDown =
		{
			enter: function (sm)
			{
				document.addEventListener('mousedown', mousedown, false)
			},
			
			leave: function (sm)
			{
				document.removeEventListener('mousedown', mousedown, false)
			}
		}
		
		})();
		
		
		;(function(){
		
		function mousemove (e)
		{
			if (Math.abs(me.startX - e.pageX) < 4 || Math.abs(me.startY - e.pageY) < 4)
				return
			
			sm.switchState('startDrag')
		}
		
		function mouseup (e)
		{
			sm.switchState('waitForMouseDown')
		}
		
		states.waitForMoveFarEnough =
		{
			enter: function (sm)
			{
				document.addEventListener('mousemove', mousemove, false)
				document.addEventListener('mouseup', mouseup, false)
			},
			leave: function (sm)
			{
				document.removeEventListener('mousemove', mousemove, false)
				document.removeEventListener('mouseup', mouseup, false)
			}
		}
		
		})();
		
		
		;(function(){
		
		function mousemove (e)
		{
			// dragover even emulation here
		}
		
		function mouseup (e)
		{
			me.stopNode = e.target
			
			sm.switchState('stopDrag')
		}
		
		states.startDrag =
		{
			enter: function (sm)
			{
				document.addEventListener('mousemove', mousemove, false)
				document.addEventListener('mouseup', mouseup, false)
			},
			job: function (sm)
			{
				var ne = document.createEvent('Event')
				ne.initEvent('dragstart', true, true)
				this.dataTransfer = ne.dataTransfer = new DataTransfer()
				this.startNode.dispatchEvent(ne)
			},
			leave: function (sm)
			{
				document.removeEventListener('mousemove', mousemove, false)
				document.removeEventListener('mouseup', mouseup, false)
			}
		}
		
		})();
		
		states.stopDrag =
		{
			job: function (sm)
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
		
		return states
	},
	
	bind: function ()
	{
		var sm = this.sm = new StateMachine(this)
		sm.setStates(this.states(sm))
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

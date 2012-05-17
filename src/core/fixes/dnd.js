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
			me.cloneNode.style.left = e.pageX + 'px'
			me.cloneNode.style.top = e.pageY + 'px'
		}
		
		function mouseup (e)
		{
			me.stopNode = e.target
			
			sm.switchState('drop')
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
				
				if (!this.dataTransfer.used)
					return sm.switchState('stopDrag')
				
				var clone = this.cloneNode = this.startNode.cloneNode(true)
				clone.id = '123'
				document.body.appendChild(clone)
				clone.addClassName('dragging-object')
				clone.style.left = '0'
				clone.style.top = '0'
			},
			leave: function (sm)
			{
				document.removeEventListener('mousemove', mousemove, false)
				document.removeEventListener('mouseup', mouseup, false)
			}
		}
		
		})();
		
		states.drop =
		{
			job: function (sm)
			{
				var ne = document.createEvent('Event')
				ne.initEvent('drop', true, true)
				ne.dataTransfer = this.dataTransfer
				this.stopNode.dispatchEvent(ne)
				
				sm.switchState('stopDrag')
			}
		}
		
		states.stopDrag =
		{
			job: function (sm)
			{
				if (this.cloneNode)
					document.body.removeChild(this.cloneNode)
				
				var ne = document.createEvent('Event')
				ne.initEvent('dragend', true, true)
				ne.dataTransfer = this.dataTransfer
				this.startNode.dispatchEvent(ne)
				
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
		this.used = true
		this.data[k] = v
	},
	
	getData: function (k)
	{
		return this.data[k]
	}
}

})();

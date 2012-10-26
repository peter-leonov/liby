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
			job: function ()
			{
				this.startNode = null
				this.cloneNode = null
				this.stopNode = null
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
			if (Math.abs(me.startX - e.pageX) < 4 && Math.abs(me.startY - e.pageY) < 4)
				return
			
			me.startX = e.pageX
			me.startY = e.pageY
			
			sm.switchState('startDrag', e)
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
				try // someone may has startNode deleted
				{
					this.startNode.dispatchEvent(ne)
				}
				catch (ex) {}
				
				
				if (!this.dataTransfer.used)
					return sm.switchState('stopDrag')
				
				var clone = this.cloneNode = this.startNode.cloneNode(true)
				document.body.appendChild(clone)
				clone.classList.add('dragging-object')
				clone.style.left = this.startX + 'px'
				clone.style.top = this.startY + 'px'
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
				try // and stopNode too
				{
					this.stopNode.dispatchEvent(ne)
				}
				catch (ex) {}
				
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
				try // and startNode once more
				{
					this.startNode.dispatchEvent(ne)
				}
				catch (ex) {}
				
				sm.switchState('waitForMouseDown')
			}
		}
		
		return states
	},
	
	bind: function ()
	{
		var sm = this.sm = new StateMachine(this)
		sm.name = 'dnd'
		sm.setStates(this.states(sm))
		sm.switchState('waitForMouseDown')
		sm.onswitch = function () {}
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

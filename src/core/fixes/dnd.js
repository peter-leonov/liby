(function(){

// this crazy hack prevents Opera's default drag action somehow
document.addEventListener('mousedown', function () {}, false)

var Me =
{
	states:
	{
		initial: function () {},
		
		waitForMouseDown: function (sm)
		{
			function mousedown (e)
			{
				this.startX = e.pageX
				this.startY = e.pageY
				
				document.removeEventListener('mousedown', mousedown, false)
				sm.switchState('waitForMoveFarEnough')
			}
			document.addEventListener('mousedown', mousedown, false)
		},
		
		waitForMoveFarEnough: function (sm)
		{
			function mousemove (e)
			{
				if (Math.abs(this.startX - e.pageX) < 4 || Math.abs(this.startY - e.pageY) < 4)
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
		},
		
		startDrag: function (sm)
		{
			function mousemove (e)
			{
				log('draggint at', e.target)
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
	
	bind: function ()
	{
		var sm = this.sm = new StateMachine(this)
		sm.setStates(this.states)
		sm.switchState('waitForMouseDown')
	}
}

Me.bind()

})();

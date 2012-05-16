(function(){

var Me =
{
	states:
	{
		initial: function () {},
		
		waitForMouseDown: function (sm)
		{
			function listener (e)
			{
				this.startX = e.pageX
				this.startY = e.pageY
				
				document.removeEventListener('mousedown', listener, false)
				sm.switchState('waitForMoveFarEnough')
			}
			document.addEventListener('mousedown', listener, false)
		},
		
		waitForMoveFarEnough: function (sm)
		{
			function listener (e)
			{
				if (Math.abs(this.startX - e.pageX) < 5 || Math.abs(this.startY - e.pageY) < 5)
					return
				
				document.removeEventListener('mousemove', listener, false)
				sm.switchState('startDrag')
			}
			document.addEventListener('mousemove', listener, false)
		},
		
		startDrag: function ()
		{
			
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

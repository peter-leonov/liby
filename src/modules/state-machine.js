(function(){

function Me (papa)
{
	this.papa = papa
}

Me.prototype =
{
	setStates: function (states)
	{
		this.states = states
		
		for (var k in states)
			states[k].stateName = k
		
		this.state = states.initial
	},
	
	onswitch: function (from, to) {},
	
	switchState: function (name)
	{
		var transition = this.states[this.state.stateName + '_to_' + name]
		if (transition)
			transition.call(this.papa, this)
		
		var from = this.state.stateName
		this.state = this.states[name]
		var to = this.state.stateName
		// log(from + ' -> ' + to)
		this.onswitch.call(this.papa, from, to)
		
		this.exec()
	},
	
	exec: function ()
	{
		this.state.call(this.papa, this)
	}
}

Me.className = 'StateMachine'
self[Me.className] = Me

})();

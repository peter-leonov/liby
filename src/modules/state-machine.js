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
		
		if (!states.initial)
			states.initial = {}
		
		for (var k in states)
			states[k].name = k
		
		this.state = states.initial
	},
	
	onswitch: function (from, to)
	{
		log(from + ' -> ' + to)
	},
	
	switchState: function (name)
	{
		if (this.inTransition)
			throw new Error('switching state in transition is not supported')
		
		var from = this.state
		var to = this.states[name]
		
		this.inTransition = true
		
		var leave = from['leave_to_' + to.name] || from.leave
		if (leave)
			leave.call(this.papa, this)
		
		this.state = to
		
		var enter = to['enter_from_' + from.name] || to.enter
		if (enter)
			enter.call(this.papa, this)
		
		this.inTransition = false
		
		this.onswitch(from.name, to.name)
		
		this.exec()
	},
	
	exec: function ()
	{
		var job = this.state.job
		if (job)
			job.call(this.papa, this)
	}
}

Me.className = 'StateMachine'
self[Me.className] = Me

})();

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
		var from = this.state
		var to = this.states[name]
		
		var leave = from['leave_to_' + to.name] || from.leave
		if (leave)
			leave.call(this.papa, this)
		
		this.state = null
		
		var enter = to['enter_from_' + from.name] || to.enter
		if (enter)
			enter.call(this.papa, this)
		
		this.state = to
		
		this.onswitch.call(this.papa, from.name, to.name)
		
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

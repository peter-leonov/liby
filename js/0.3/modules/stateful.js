;(function(){

var myName = 'Stateful',
	Me = self[myName] = Module(myName)

Me.prototype =
{
	stateChanged: function (state) { log('please, define a useful stateChanged method in ' + this.constructor.className) },
	mergeState: function (state) { log('please, define a useful mergeState method in ' + this.constructor.className) },
	
	initStateful: function ()
	{
		this.state = {}
	},
	
	bindStateful: function (saver)
	{
		this.stateSaver = saver
		var me = this
		saver.addEventListener('change', function (e) { me.setState(me.loadState()) }, false)
		
		var state = {}
		Object.extend(state, this.defaultState)
		Object.extend(state, this.loadState())
		this.setState(state)
	},
	
	saveState: function ()
	{
		// what has changed since default state
		var diff = this.diffState(this.defaultState, this.state)
		
		// // if nothing then holding still
		// if (Object.keys(diff) == 0)
		// 	return
		
		// saving the difference to the saver
		if (this.stateSaver)
			this.stateSaver.set(UrlEncode.stringify(diff))
	},
	
	loadState: function (value)
	{
		return UrlEncode.parse(this.stateSaver.get())
	},
	
	setState: function (next)
	{
		var diff = this.diffState(this.state, next)
		this.mergeState(diff, next)
	},
	
	diffState: function (a, b)
	{
		var d = {}
		
		for (var k in b)
			if (!(k in a) || a[k] !== b[k])
				d[k] = b[k]
		
		return d
	}
}

})();

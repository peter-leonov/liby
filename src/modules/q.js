;(function () {

function Q (callback, min)
{
	this.callback = callback
	this.min = +min || 0
	
	this.state = []
	this.total = 0
}

Q.prototype =
{
	wait: function ()
	{
		var n = this.state.push(false) - 1
		var queue = this
		return function listener () { queue._fire(n) }
	},
	
	_fire: function (n)
	{
		var state = this.state
		if (state[n])
			return
		state[n] = true
		
		if (++this.total == (this.min || state.length))
			this._done()
	},
	
	_done: function ()
	{
		var callback = this.callback
		if (!callback)
			return
		this.callback = null
		
		callback.call()
	},
	
	// handy shortcuts
	all: function ()
	{
		new Q(this.wait())
	},
	
	any: function ()
	{
		new Q(this.wait(), 1)
	}
}


Q.all = function all (callback)
{
	return new Q(callback)
}

Q.any = function any (callback)
{
	return new Q(callback, 1)
}


self.Q = Q

})();
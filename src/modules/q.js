;(function(){

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
		return function listener () { queue._got(n) }
	},
	
	_got: function (n)
	{
		var state = this.state
		if (state[n])
			return
		state[n] = true
		
		if (++this.total == (this.min || state.length))
			this.fire()
	},
	
	fire: function ()
	{
		var callback = this.callback
		if (!callback)
			return
		this.callback = null
		
		callback.call()
	},
	
	// handy shortcuts
	n: function (n)
	{
		return new Q(this.wait(), n)
	},
	
	all: function ()
	{
		return new Q(this.wait())
	},
	
	any: function ()
	{
		return new Q(this.wait(), 1)
	}
}


Q.n = function all (callback, n)
{
	return new Q(callback, n)
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
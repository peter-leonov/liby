;(function(){

var myName = 'Cloner'

function Me ()
{
	this.nodes = {}
	this.constructor = Me
}

Me.prototype =
{
	bind: function (root, nodes)
	{
		this.root = root
		this.nodes = nodes
		
		return this
	},
	
	getPaths: function (nodes)
	{
		for (var k in nodes)
			log(nodes[k])
	},
	
	create: function ()
	{
		return this.root.cloneNode(true)
	},
}

// Me.mixIn(EventDriven)
Me.className = myName
self[myName] = Me

})();
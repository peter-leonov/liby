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
		
		this.sync()
		
		return this
	},
	
	sync: function ()
	{
		this.paths = this.getPaths(this.root, this.nodes)
	},
	
	getPaths: function (root, nodes)
	{
		var paths = {}
		for (var k in nodes)
			paths[k] = root.childIndexedPath(nodes[k])
		return paths
	},
	
	getNodes: function (root, paths)
	{
		var nodes = {}
		for (var k in paths)
			nodes[k] = root.getChildByIndexedPath(paths[k])
		return nodes
	},
	
	create: function ()
	{
		var root = this.root.cloneNode(true),
			nodes = this.getNodes(root, this.paths)
		
		return {root: root, nodes: nodes}
	}
}

// Me.mixIn(EventDriven)
Me.className = myName
self[myName] = Me

})();
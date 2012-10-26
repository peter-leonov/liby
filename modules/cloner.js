;(function(){

var myName = 'Cloner'

function Me ()
{
	this.nodes = {}
	this.constructor = Me
}

var O = Object

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
		function walk (hash)
		{
			var paths = {}
			for (var k in hash)
			{
				var v = hash[k]
				
				if (v.constructor == O)
				{
					paths[k] = walk(v)
					continue
				}
				
				paths[k] = root.childIndexedPath(v)
			}
			return paths
		}
		
		return walk(nodes)
	},
	
	getNodes: function (root, paths)
	{
		function walk (hash)
		{
			var nodes = {}
			for (var k in hash)
			{
				var v = hash[k]
				
				if (v.constructor == O)
				{
					nodes[k] = walk(v)
					continue
				}
				
				nodes[k] = root.getChildByIndexedPath(v)
			}
			return nodes
		}
		
		return walk(paths)
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
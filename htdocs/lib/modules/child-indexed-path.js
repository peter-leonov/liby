;(function(){

var myProto =
{
	childIndexedPath: function (node)
	{
		var path = []
		path:
		for (;;)
		{
			if (node == this)
				break
			
			var parent = node.parentNode
			if (!parent)
				return null
			
			var childs = parent.childNodes
			for (var i = 0, num = 0, il = childs.length; i < il; i++)
			{
				var child = childs[i]
				if (child == node)
				{
					path.push(num)
					node = parent
					continue path
				}
				// to provide a path useful cross browser lets count only the elements
				else if (child.nodeType == 1)
					num++
			}
			// we'r here if child node lied to us about its parentNode
			return null
		}
		
		return path.reverse()
	},
	
	getChildByIndexedPath: function (path)
	{
		var node = this
		path:
		for (var i = 0, il = path.length; node && i < il; i++)
		{
			var n = path[i],
				childs = node.childNodes
			// if there is no children this loop will be skipped
			// so we can not go too deep
			for (var j = 0, jl = childs.length; j < jl; j++)
			{
				var child = childs[j]
				if (child.nodeType == 1)
					if (n == 0)
					{
						node = child
						continue path
					}
					else
						n--
			}
			// we are here only if child num goes out of bounds
			return null
		}
		return node
	}
}

Object.add(Element.prototype, myProto)
Object.add(document, myProto)


})();
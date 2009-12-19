;(function(){

var myProto =
{
	childIndexedPath: function (node)
	{
		var path = []
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
					break
				// to provide a path useful cross browser lets count only the elements
				else if (child.nodeType == 1)
					num++
			}
			
			path.push(num)
			node = parent
		}
		
		return path.reverse()
	}
}

Object.add(Element.prototype, myProto)
Object.add(document, myProto)


})();
(function(){

var doc = document, win = window, undef

function fixNodesShortcut ()
{
	if (win.NodesShortcut)
	{
		log('NodesShortcut.E was altered with fixed version')
		win.NodesShortcut.E = function (tag, cn, props)
		{
			var node
			if (props)
			{
				var html = [], name, i, names = ['name', 'type']
				
				for (i = 0; i < names.length; i++)
				{
					name = names[i]
					if (name in props)
					{
						html.push(name + '="' + props[name].replace(/"/, '\\"') + '"')
						delete props[name]
					}
				}
				
				node = doc.createElement('<' + tag + ' ' + html.join(' ') + '>')
				
				for (i in props)
					node[i] = props[i]
			}
			else
				node = doc.createElement(tag)
			
			if (cn !== undef)
				node.className = cn
			
			return node
		}
	}
}

win.addEventListener('load', fixNodesShortcut)

})();
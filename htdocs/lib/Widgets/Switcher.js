Switcher =
{
	bind: function (main, buttons, tabs, names)
	{
		if (!main || !buttons || !tabs)
			throw new Error('main, buttons or tabs are not defined: ' + [!!main, !!buttons, !!tabs].join(', '))
		main.nodes = {buttons: Array.copy(buttons), tabs: Array.copy(tabs)}
		main.names = names || []
		
		main.autoSelect = true
		main.onselect = function () {}
		main.setTabs = function (tabs) { this.nodes.tabs = tabs }
		main.setNames = function (names) { this.names = names }
		main.select = function (num)
		{
			if (typeof num != 'number')
				num = this.names.indexOf(num)
			
			var buttons = this.nodes.buttons
			
			var selected = buttons[num]
			if (selected)
			{
				for (var i = 0; i < buttons.length; i++)
					buttons[i].remClassName('selected')
				
				selected.addClassName('selected')
			}
			
			var tabs = this.nodes.tabs
			if (tabs && tabs[num])
			{
				for (var i = 0; i < tabs.length; i++)
					tabs[i].hide()
				tabs[num].show()
			}
		}
		
		function isParent (node, parent, root)
		{
			do
			{
				// log(node)
				if (node == parent)
					return true
				if (node == root)
					return false
			}
			while (node = node.parentNode)
			
			return false
		}
		
		function select (e)
		{
			var buttons = this.nodes.buttons
			var num = -1
			for (var i = 0; i < buttons.length; i++)
				if (isParent(e.target, buttons[i], this))
					num = i
			
			if (num > -1 && this.onselect(num, e.target) !== false && this.autoSelect)
				return this.select(num, e.target)
			
			return false
		}
		main.addEventListener('mousedown', select, false)
		
		return main
	}
}

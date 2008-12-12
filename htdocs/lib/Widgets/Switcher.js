Switcher =
{
	bind: function (main, buttons, tabs, names)
	{
		if (!main || !buttons || !tabs)
			throw new Error('main, buttons or tabs are not defined: ' + [!!main, !!buttons, !!tabs].join(', '))
		main.nodes = {buttons: Array.copy(buttons), tabs: Array.copy(tabs)}
		main.names = names || []
		
		main.onselect = function () {}
		main.setTabs = function (tabs) { this.nodes.tabs = tabs }
		main.setNames = function (names) { this.names = names }
		main.select = function (num)
		{
			if (typeof num != 'number')
				num = this.names.indexOf(num)
			
			if (num < 0 || this.onselect(num) === false)
				return
			
			this.drawSelected(num)
		}
		main.drawSelected = function (num)
		{
			if (typeof num != 'number')
				num = this.names.indexOf(num)
			
			if (num < 0)
				return
			
			var buttons = this.nodes.buttons
			for (var i = 0; i < buttons.length; i++)
				if (buttons[i])
					num == i ? buttons[i].addClassName('selected') : buttons[i].removeClassName('selected')
			
			var tabs = this.nodes.tabs
			if (tabs && tabs[num])
				for (var i = 0; i < tabs.length; i++)
					if (tabs[i])
						num == i ? tabs[i].show() : tabs[i].hide()
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
		
		function mouseSelect (e)
		{
			var buttons = this.nodes.buttons
			var num = -1
			for (var i = 0; i < buttons.length; i++)
				if (isParent(e.target, buttons[i], this))
					num = i
			
			return this.select(num)
		}
		main.addEventListener('mousedown', mouseSelect, false)
		
		return main
	}
}

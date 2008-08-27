var Selecter =
{
	stack: [],
	
	bind: function (main)
	{
		main.nodes =
		{
			button:  main.getElementsByClassName('button')[0],
			caption: main.getElementsByClassName('caption')[0],
			options: main.getElementsByClassName('options')[0]
		}
		
		if (!main.onselect)
		 	main.onselect = function () {}
		
		main.setCaption = function (str)
		{
			this.nodes.caption.innerHTML = str
		}
		
		main.setOptions = function (options)
		{
			var optionsNode = this.nodes.options
			optionsNode.empty()
			
			this.remClassName('empty')
			this.remClassName('single')
			
			if (options && options.length)
			{
				for (var i = 0; i < options.length; i++)
				{
					var li = document.createElement('li')
					li.appendChild(document.createTextNode(options[i]))
					optionsNode.appendChild(li)
				}
				
				if (options.length == 1)
					this.addClassName('single')
			}
			else
				this.addClassName('empty')
			
			return options
		}
		
		main.getNodeNumber = function (node)
		{
			var optionsChilds = this.nodes.options.childNodes
			for (var i = 0; i < optionsChilds.length; i++)
				if (optionsChilds[i] == node)
					return i
			return -1
		}
		
		main.getValueNumber = function (val)
		{
			var optionsChilds = this.nodes.options.childNodes
			for (var i = 0; i < optionsChilds.length; i++)
				if (optionsChilds[i].innerHTML == val)
					return i
			return -1
		}
		
		main.removeGarbageNodes = function ()
		{
			var options = this.nodes.options
			var optionsChilds = this.nodes.options.childNodes
			for (var i = 0; i < optionsChilds.length; i++)
				if (optionsChilds[i].nodeType != 4)
					options.removeChild(optionsChilds[i])
		}
		
		main.select = function (num, force)
		{
			if (typeof num !== 'number')
				num = this.getValueNumber(num)
			var optionsChilds = Array.copy(this.nodes.options.childNodes)
			var selected = optionsChilds[num]
			if (selected)
			{
				if (!force && this.onselect(selected.innerHTML, num, selected) === false)
					return
				
				for (var i = 0; i < optionsChilds.length; i++)
					optionsChilds[i].remClassName('selected')
				
				selected.addClassName('selected')
				this.setCaption(selected.innerHTML)
			}
			else
				log('Can`t select option with value "'+num+'": no such option`')
		}
		
		main.removeGarbageNodes()
		
		function close (e)
		{
			main.remClassName('open')
			main.addEventListener('mousedown', open, false)
			main.removeEventListener('mousedown', close, false)
			document.removeEventListener('mouseup', close, false)
		}
		
		function open (e)
		{
			if (main.nodes.options.childNodes.length < 2)
				return
			Selecter.closeAll()
			e.stopPropagation()
			main.addClassName('open')
			main.addEventListener('mousedown', close, false)
			main.removeEventListener('mousedown', open, false)
			document.addEventListener('mouseup', close, false)
		}
		
		function select (e)
		{
			e.stopPropagation()
			close()
			var target = e.target
			if (target.nodeName == 'LI')
				main.select(main.getNodeNumber(target))
		}
		
		main.open = open
		main.close = close
		
		main.addEventListener('mousedown', open, false)
		main.addEventListener('mouseup', function (e) { e.stopPropagation() }, false)
		main.nodes.options.addEventListener('mousedown', select, false)
		main.nodes.options.addEventListener('mouseup', select, false)
		
		main.setOptions([])
		this.stack.push(main)
		
		return main
	},
	
	closeAll: function ()
	{
		for (var i = 0; i < this.stack.length; i++)
			this.stack[i].close()
	}
}

;(function(){

var myName = 'Selecter'

function Me (group)
{
	this.nodes = {optionsCache: []}
	this.constructor = Me
	
	this.valToNum = {}
	this.options = []
	this.optionPresent = []
	
	this.lastSelected = -1
	
	this.group = group
	
	var arr = Me.groups[group]
	if (arr)
		arr.push(this)
	else
		Me.groups[group] = [this]
}

Me.groups = {}
Me.closeGoup = function (group)
{
	var arr = Me.groups[group]
	
	if (!arr)
		return
	
	for (var i = 0, il = arr.length; i < il; i++)
		arr[i].close()
}


eval(NodesShortcut.include())

Me.prototype =
{
	bind: function (nodes)
	{
		this.nodes = nodes
		nodes.optionsCache = []
		
		this.bindEvents()
		
		return this
	},
	
	bindEvents: function ()
	{
		var nodes = this.nodes,
			main = nodes.main,
			me = this
		
		function open (e)
		{
			e.preventDefault()
			Me.closeGoup(me.group)
			
			main.addClassName('open')
			main.addEventListener('mousedown', close, false)
			main.removeEventListener('mousedown', open, false)
			document.addEventListener('mouseup', close, false)
		}
		
		function close ()
		{
			main.removeClassName('open')
			main.addEventListener('mousedown', open, false)
			main.removeEventListener('mousedown', close, false)
			document.removeEventListener('mouseup', close, false)
		}
		
		function select (e)
		{
			e.stopPropagation()
			close(e)
			me.select(e.target.getAttribute('data-selecter-option-num'))
		}
		
		this.close = close
		
		main.addEventListener('mousedown', open, false)
		main.addEventListener('mouseup', function (e) { e.stopPropagation() }, false)
		
		var options = nodes.options
		options.addEventListener('mousedown', select, false)
		options.addEventListener('mouseup', select, false)
	},
	
	close: function () {},
	
	setOptions: function (options)
	{
		var nodes = this.nodes,
			root = nodes.options,
			main = nodes.main
		
		root.empty()
		var valToNum = this.valToNum = {},
			optionsCache = nodes.optionsCache = []
		
		this.options = options
		var optionPresent = this.optionPresent = []
		
		if (!options.length)
		{
			main.removeClassName('single')
			main.addClassName('empty')
			return options
		}
		
		main.removeClassName('empty')
		
		for (var i = 0; i < options.length; i++)
		{
			var option = options[i]
			
			valToNum[option] = i
			optionPresent[i] = true
			
			var li = optionsCache[i] = Nc('li', 'option')
			li.setAttribute('data-selecter-option-num', i)
			li.appendChild(T(option))
			root.appendChild(li)
		}
		
		if (options.length == 1)
			main.addClassName('single')
		else
			main.removeClassName('single')
		
		return options
	},
	
	setCaption: function (value)
	{
		var button = this.nodes.button
		button.empty()
		button.appendChild(T(value))
	},
	
	select: function (num)
	{
		if (!this.optionPresent[num])
			return
		
		if (!this.dispatchEventData('select', {value: this.options[num], num: num}))
			return
		
		this.renderSelected(num)
		
	},
	
	renderSelectedValue: function (value)
	{
		this.renderSelected(this.valToNum[value])
	},
	
	renderSelected: function (num)
	{
		if (num === this.lastSelected)
			return
		
		var optionsCache = this.nodes.optionsCache
			
		var last = optionsCache[this.lastSelected]
		if (last)
			last.removeClassName('selected')
		
		optionsCache[num].addClassName('selected')
		
		this.setCaption(this.options[num])
		
		var main = this.nodes.main
		main.removeClassName('selected-option-' + this.lastSelected)
		main.addClassName('selected-option-' + num)
		
		this.lastSelected = num
	}
}

Me.mixIn(EventDriven)
Me.className = myName
self[myName] = Me

})();

var Selecter1 =
{
	stack: [],
	
	bind: function (main)
	{
		main.nodes =
		{
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
			var optionsChilds = Array.from(this.nodes.options.childNodes)
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

;(function(){

var myName = 'TabSwitcher'

function Me ()
{
	this.nodes = {tabs:[], sections:[]}
}

Me.prototype =
{
	eventType: 'mousedown',
	
	bind: function (nodes)
	{
		var me = this
		this.mouseListener = function (e) { me.onMouse(e, this) }
		
		this.setTabs(nodes.tabs)
		this.setSections(nodes.sections)
		
		return this
	},
	
	unbind: function ()
	{
		this.setTabs([])
	},
	
	onMouse: function (e, node)
	{
		var tabs = this.nodes.tabs,
			i, num = -1, value
		
		for (i = 0; i < tabs.length; i++)
			if (node === tabs[i])
			{
				value = node.getAttribute('data-tab-name')
				num = i
			}
		
		this.select(value, num)
	},
	
	select: function (value, num)
	{
		var ok = this.dispatchEventData('select', {value: value, num: num})
		if (ok)
			this.renderSelected(num)
		return ok
	},
	
	setTabs: function (tabs)
	{
		var listener = this.mouseListener, node, eventType = this.eventType
		
		var old = this.nodes.tabs
		for (var i = 0; i < old.length; i++)
			if ((node = old[i]))
				node.removeEventListener(eventType, listener, false)
		
		var numByName = this.numByName = {},
			names = this.names = []
		this.nodes.tabs = tabs
		for (var i = 0; i < tabs.length; i++)
			if ((node = tabs[i]))
			{
				node.addEventListener(eventType, listener, false)
				var name = node.getAttribute('data-tab-name')
				if (name !== undefined)
				{
					numByName[name] = i
					names.push(name)
				}
			}
	},
	
	getNames: function () { return this.names },
	
	setSections: function (sections)
	{
		this.nodes.sections = sections
	},
	
	renderSelected: function (num)
	{
		var nodes = this.nodes, node
		
		if (typeof num !== 'number')
			num = this.numByName[num]
		
		var tabs = nodes.tabs
		for (var i = 0; i < tabs.length; i++)
			if ((node = tabs[i]))
				node.classList.toggleTo('selected', num === i)
		
		var sections = nodes.sections
		for (var i = 0; i < sections.length; i++)
			if ((node = sections[i]))
				node.classList.toggleTo('hidden', num !== i)
	}
}

Me.mixIn(EventDriven)

self[myName] = Me
Me.className = myName

})();
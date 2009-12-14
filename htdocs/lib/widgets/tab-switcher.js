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
		// if (e.target != node)
		// 	return
		
		var tabs = this.nodes.tabs,
			i, num = -1
		
		for (i = 0; i < tabs.length; i++)
			if (node === tabs[i])
				num = i
		
		if (!this.select(num))
			e.preventDefault()
	},
	
	select: function (num)
	{
		var ok = this.dispatchEventData('select', {num:num})
		if (ok)
			this.renderSelected(num)
		return ok
	},
	
	setTabs: function (tabs)
	{
		var i, old = this.nodes.tabs, listener = this.mouseListener
		
		for (i = 0; i < old.length; i++)
			if (old[i])
				old[i].removeEventListener(this.eventType, listener, false)
		
		this.nodes.tabs = tabs
		
		for (i = 0; i < tabs.length; i++)
			if (tabs[i])
				tabs[i].addEventListener(this.eventType, listener, false)
	},
	
	setSections: function (sections)
	{
		this.nodes.sections = sections
	},
	
	renderSelected: function (num)
	{
		var i, node, nodes = this.nodes, tabs = nodes.tabs, sections = nodes.sections
		
		for (i = 0; i < tabs.length; i++)
			if ((node = tabs[i]))
				node.toggleClassName('selected', num === i)
		
		for (i = 0; i < sections.length; i++)
			if ((node = sections[i]))
				node.toggleClassName('hidden', num !== i)
	}
	
}

Class.setup(Me, myName)
self[myName] = Me

Me.mixIn(EventDriven)

})();
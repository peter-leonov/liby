
window.addEventListener('load', function () { Programica.FunnyBlock.onLoader() }, false)

Programica.FunnyBlock =
{
	bind: function (node)
	{
		node.pmc || (node.pmc = {})
		node.pmc.imageRoller = new Programica.FunnyBlock.Handler(node)
		node.pmc.imageRoller.goInit()
	},
	
	Handler: function (node)
	{
		this.mainNode = node
		this.viewport = node
		var t = this
		
		this.toogler = node.getElementsByClassName('funny-toogler')[0]
		this.begin = node.getElementsByClassName('funny-begin')[0]
		this.end = node.getElementsByClassName('funny-end')[0]
		
		this.current = 0
		
		this.toogler.onclick = function () { t.toggle() }
	},
	
	onLoader: function ()
	{
		var all = document.getElementsByClassName('programica-funny-block')
		
		for (var i = 0; i < all.length; i++)
			this.bind(all[i])
	}
}

Programica.FunnyBlock.Handler.prototype =
{
	defaultAnimationType: function () { return this.mainNode.getAttribute('animation-type') || 'easeOutBack' }, //easeOutBounce
	
	goInit: function (n)
	{
		this.goToNode(this.begin, 'directJump')
		this.current = 0
	},
	
	toggle: function (anim)
	{
		this.current = (this.current + 1) % 2
		var t = this
		
		if (this.current)
			this.goToNode(this.end),
			this.viewport.className = this.viewport.className.replace(/ active/g, ""),
			this.viewport.className += ' active'
		else
			this.goToNode(this.begin).addEventListener
			(
				'complete',
				function () { t.viewport.className = t.viewport.className.replace(/ active/g, "") }
			)
	},
	
	goToNode: function (node, anim)
	{
		if (!node) return null
		anim = anim || node.getAttribute('animation-type') || this.defaultAnimationType()
		
		if (!this.viewport) log('Viewport is undefined!')
		if (!this.viewport.animate) log('Viewport can`t be animated!')
		
		return this.viewport.animate(anim, {scrollTop:  [node.offsetTop], scrollLeft: [node.offsetLeft], height:  [node.offsetHeight], width: [node.offsetWidth]},  1).start()
	}
}
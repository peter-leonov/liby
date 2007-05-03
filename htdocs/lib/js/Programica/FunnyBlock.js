
Programica.FunnyBlock = function () {}

Programica.FunnyBlock.prototype = new Programica.Widget()
Programica.FunnyBlock.prototype.mainNodeClassName = 'programica-funny-block'
Programica.FunnyBlock.prototype.Handler = function (node)
{
	this.mainNode = node
	this.viewport = node
	var t = this
	
	this.toogler = node.getElementsByClassName('funny-toogler')[0]
	this.begin = node.getElementsByClassName('funny-begin')[0]
	this.end = node.getElementsByClassName('funny-end')[0]
	
	this.current = 0
	
	this.toogler.onclick = function () { t.toggle() }
}


Programica.FunnyBlock.prototype.Handler.prototype =
{
	defaultAnimationType: function () { return this.mainNode.getAttribute('animation-type') || 'easeOutBack' }, //easeOutBounce
	
	init: function () { this.goInit() },
	
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

Programica.Widget.register(new Programica.FunnyBlock())
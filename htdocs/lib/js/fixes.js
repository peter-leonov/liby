
Programica.Fixes =
{
	all: function ()
	{
		this.runtimeStyle.behavior = 'none'
		Programica.Fixes.fixPng.apply(this)
		Programica.Fixes.fixTitle.apply(this)
		Programica.Fixes.fixPrototype.apply(this)
	},
	
	fixPng: function ()
	{
		this.runtimeStyle.filter="progid:DXImageTransform.Microsoft.AlphaImageLoader(src='" + this.src + "', sizingMethod='image')"
		//this.style.visibility = 'hidden'
		this.setAttribute('src', '/lib/img/dot.gif')
	},
	
	fixTitle: function ()
	{
		if (!this.title) this.title = ''
	},
	
	fixPrototype: function ()
	{
		if (window.extend && window.HTMLElement) extend(this, HTMLElement.prototype)
	}
}

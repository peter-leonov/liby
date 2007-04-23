
if (!window.Programica) Programica = {}

Programica.Fixes =
{
	all: function ()
	{
		this.runtimeStyle.behavior = 'none'
		
		Programica.Fixes.fixTitle.apply(this)
		Programica.Fixes.fixPrototype.apply(this)
		
		if (/MSIE 6/.test(navigator.userAgent))
		{
			Programica.Fixes.fixPng.apply(this)
			Programica.Fixes.fixTitle.apply(this)
			Programica.Fixes.fixLabel.apply(this)
			Programica.Fixes.fixPrototype.apply(this)
		}
		
		if (/MSIE 7/.test(navigator.userAgent))
		{
			Programica.Fixes.fixTitle.apply(this)
			Programica.Fixes.fixPrototype.apply(this)
		}
	},
	
	//——————————————————————————————————————————————————————————————————————————
	
	
	fixPng: function ()
	{
		if (this.tagName != 'IMG' || this.runtimeStyle.filter) return
		if (/\.png$/.test(this.src))
		{
			this.runtimeStyle.filter = "progid:DXImageTransform.Microsoft.AlphaImageLoader(src='" + this.src + "', sizingMethod='image')"
			//this.style.visibility = 'hidden'
			this.setAttribute('src', '/lib/img/dot.gif')
		}
	},
	
	/* убирает лишние подсказки */
	fixTitle: function ()
	{
		if (!this.title) this.title = ''
	},
	
	/* делает кликабельными метки */
	fixLabel: function ()
	{
		//this.attachEvent("onclick", function () {this.getElementsByTagName('input')[0] && this.getElementsByTagName('input')[0].click()})
	},
	
	/* добавляет методы и свойства из HTMLElement.prototype */
	fixPrototype: function ()
	{
		if (window.extend && window.HTMLElement) extend(this, HTMLElement.prototype)
	}
}

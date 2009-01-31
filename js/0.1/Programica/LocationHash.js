// beta :)
var LocationHash =
{
	onchange: function () {  },
	bind: function (loc)
	{
		this.location = loc
		this.lastHash = this.location.hash
		
		var me = this
		function check ()
		{
			if (me.location.hash != me.lastHash)
			{
				me.lastHash = me.location.hash
				me.onchange(me.get(), me.last)
			}
		}
		
		setInterval(check, 500)
		document.addEventListener('click', function () { setTimeout(check, 50) }, true)
	},
	
	set: function (val)
	{
		this.location.hash = this.last = String(val)
		this.lastHash = this.location.hash
	},
	
	get: function ()
	{
		return this.location.hash.replace(/^#/, '')
	}
}

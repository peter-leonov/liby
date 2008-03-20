
// Opera screen image caching fix
window.addEventListener
(
	'load',
	function (e)
	{
		var d = document.documentElement
		setInterval
		(
			function ()
			{
				try
				{
					var old = d.getComputedStyle().backgroundRepeat
					d.style.backgroundRepeat = 'none'
					d.style.backgroundRepeat = old
				}
				catch (ex) {}
			},
			250
		)
	},
	false
)

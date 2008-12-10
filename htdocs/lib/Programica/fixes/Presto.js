
if (self.opera && opera.postError)
{
	if (!self.log)
		self.log = function () { return self.opera.postError(arguments) }
	
	if (!self.reportError)
		self.reportError = self.log
}
else
	self.log = self.reportError = function () {  }

if (/Opera\/9\.2/.test(navigator.userAgent))
{
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
}

;(function(){

var Me =
{
	guessOS: function (ua)
	{
		var m = /Windows/.exec(ua)
		if (m)
			return ['win']
		
		var m = /Macintosh|Mac OS/.exec(ua)
		if (m)
			return ['mac']
	},
	
	guessBrowser: function (ua)
	{
		function classes (n, a, b, c)
		{
			return [n, n + '-' + a, n + '-' + a + '-' + b, n + '-' + a + '-' + b + '-' + c]
		}
		
		var m = /Firefox\/(\d+)\.(\d+)\.(\d+)/.exec(ua)
		if (m)
			return classes('firefox', m[1], m[2], m[3])
		
		var m = /Opera\/\d+.+Version\/(\d+)\.(\d)(\d)/.exec(ua)
		if (m)
			return classes('opera', m[1], m[2], m[3])
		
		var m = /Opera\/(\d+)\.(\d)(\d)/.exec(ua)
		if (m)
			return classes('opera', m[1], m[2], m[3])
		
		var m = /MSIE (\d+)\./.exec(ua)
		if (m)
			return ['msie', 'msie-' + m[1]]
		
		var m = /Version\/(\d+)\.(\d+)\.(\d+) Safari\/\d+/.exec(ua)
		if (m)
			return classes('safari', m[1], m[2], m[3])
		
		var m = /Chrome\/(\d+)\.(\d+)\.(\d+)/.exec(ua)
		if (m)
			return classes('chrome', m[1], m[2], m[3])
		
		return []
	},
	
	getClassNames: function (ua)
	{
		return guessOS(ua).concat(guessBrowser(ua))
	},
	
	setupDocumentElementClassNames: function (ua)
	{
		document.documentElement.addClassName(this.getClassNames(ua || navigator.userAgent).join(' '))
	}
}

Me.className = 'UserAgent'
self[Me.className] = Me

})();

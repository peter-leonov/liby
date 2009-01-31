if (!self.Programica)
	self.Programica = {}

// light infantile browser matching
Programica.userAgentRegExps =
{
	MSIE: /MSIE/,
	MSIE6: /MSIE 6/,
	MSIE7: /MSIE 7/,
	Gecko: /Gecko\//,
	Opera: /Opera/,
	Opera9: /Opera\/9/,
	Safari: /AppleWebKit/,
	Safari2: /AppleWebKit\/4/,
	Safari3: /AppleWebKit\/5/
}
        
Programica.htmlUserAgentSetter = function (doc, ua)
{
	doc = doc || document
	ua = ua || navigator.userAgent
	
	var htmlNode = doc.documentElement
	for (var p in this.userAgentRegExps)
		if (this.userAgentRegExps[p].test(ua))
			htmlNode.className = (htmlNode.className || '') + ' ' + p
}

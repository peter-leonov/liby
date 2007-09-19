
<!--#if expr="$SERVER_TYPE=/development/" -->
	
	<!--#include file="Programica.thin.js" -->
	
	Programica.get = function (url)
	{
		var r = window.XMLHttpRequest ? (new XMLHttpRequest()) : (new ActiveXObject("Msxml2.XMLHTTP"))
		r.open('GET', url, false)
		r.send(null)
		return r.responseText
	}
	
	Programica.require = function (src)
	{
		document.head = document.getElementsByTagName('head')[0]
		
		// cecking write() cousre it may throw an exeption in XHTML
		var cantWriteScript = !!window.opera
		try { document.write(' ') }
		catch (ex) { cantWriteScript = true }
		
		if (document.write && !cantWriteScript)
			document.write('<script type="text/javascript" src=' + src + '></script>')
		else if (/html/i.test(document.contentType) && document.head && !window.safari3)
		{
			//if (document.head.firstChild)
			//	document.head.insertBefore($E('script', {type:"text/javascript", src:src}), document.head.firstChild)
			//else
				document.head.appendChild($E('script', {type:"text/javascript", src:src}))
		}
		else if (Programica.get)
		{
			var code = Programica.get(src)
			//alert(src + '\n' + code)
			window.eval ? window.eval(code) : eval(code)
		}
		else
			alert('Can`t find the way to require "' + src + '"')
	}
	
	<!--#if expr="$HTTP_USER_AGENT = /Gecko\//" -->
		Programica.require("/lib/Programica/FFFixes.js")
	<!--#endif -->
	
	<!--#if expr="$HTTP_USER_AGENT = /MSIE/" -->
		Programica.require("/lib/Programica/IEFixes.js")
	<!--#endif -->
	
	<!--#if expr="$HTTP_USER_AGENT = /AppleWebKit\/4/" -->
		Programica.require("/lib/Programica/WK4Fixes.js")
	<!--#endif -->
	
	Programica.require("/lib/Programica/Development.js")
	
	Programica.require("/lib/Programica/DOM.js")
	Programica.require("/lib/Programica/Animation.js")
	Programica.require("/lib/Programica/Request.js")
	Programica.require("/lib/Programica/Form.js")
	Programica.require("/lib/Programica/Widget.js")
	
	log2("Programica.js loaded")
	
<!--#else -->

	<!--#include file="Programica.full.js" -->
	
<!--#endif -->
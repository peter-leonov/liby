
// at this stage no fixes or wrappers from any lib is loaded
// so you can see some dirty "cross browser" code here

//window.onerror = function (a,b,c) { alert(a) }

self.onerror = window.onerror = function (message, url, line)
{
	try
	{
		var err = message + ' at ' + url + ':' + line
		
		var fr = document.createElement('img')
		fr.src = '/lib/bugs-catcher.pl?error=' + escape(err)
		
		/*var timer
		timer = setInterval
		(
			function ()
			{
				if ((body = document.getElementsByTagName('body')[0]))
				{
					body.appendChild(fr) && clearInterval(timer)
					fr.style.display = 'none'
				}
			},
			500
		)*/
	}
	catch (ex) { alert(ex.message) }
	
	return true
}



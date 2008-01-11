try { console.log('Programica BugsCatcher enabled') } catch (ex) {}

// at this stage no fixes or wrappers from any lib is loaded
// so you can see some dirty "cross browser" code here

//window.onerror = function (a,b,c) { alert(a) }

self.onerror = window.onerror = function (message, url, line)
{
	try
	{
		var err = message + '\n' + url + ':' + line
		
		var fr = document.createElement('img')
		fr.src = '/lib/bugs-catcher.cgi?' + (window.encodeURIComponent || window.escape)(err)
 	}
	catch (ex) { alert(ex.message) }
	
	return true
}



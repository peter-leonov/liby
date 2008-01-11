try { console.log('Programica BugsCatcher enabled') } catch (ex) {}

// at this stage no fixes or wrappers from any lib is loaded
// so you can see some dirty "cross browser" code here

//window.onerror = function (a,b,c) { alert(a) }

var bugsCatcher =
{
	errStack: [],
	
	save: function (message, url, line)
	{
		try
		{
			var err = message + '\n' + url + ':' + line
			bugsCatcher.errStack.push((window.encodeURIComponent || window.escape)(err))
		}
		catch (ex) { /*alert(ex.message)*/ }
	
		return true
	},
	
	send: function ()
	{
		if (bugsCatcher.errStack.length)
		{
			var data = bugsCatcher.errStack.join(';')
			var fr = document.createElement('img')
			fr.src = '/lib/bugs-catcher.cgi?errs=' + data
		
			bugsCatcher.errStack = []
		}
	}
}

self.onerror = window.onerror = function (message, url, line)
{
	try { bugsCatcher.save(message, url, line) } catch (ex) { /*alert(ex.message)*/ }
	return true
}

timer = setInterval(function () { bugsCatcher.send() }, 3000)

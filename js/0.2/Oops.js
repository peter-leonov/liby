// at this stage no fixes or wrappers are loaded from any lib
// so you can see some dirty "cross browser" code here

if (!(/Oops=disabled/.test(document.cookie)))
{
	try { console.log('Oops enabled') } catch (ex) {}
	
	function Oops (message, url, line, type)
	{
		try // to fully describe an error
		{
			var href = 'http://oops.programica.ru/report',
				esc = window.encodeURIComponent || window.escape,
				q = '?url=' + esc(url + ':' + line) + '&message=' + esc(message) + '&session=' + Oops.session + '&type=' + (type || 'error')
			
			Oops.request(q)
		}
		catch (ex)
		{
			try // to scream for help
			{
				Oops.request(href + '?message=cant+report&type=error')
			}
			catch (ex) {}
		}
		
		return true
	}
	
	Oops.session = (new Date()).getTime().toString() + Math.round(Math.random() * 1E+17)
	Oops.request = function (src)
	{
		var I = new Image(1,1)
		I.src = src
		I.onload = function () {}
	}
	
	window.onerror = Oops
}xxx
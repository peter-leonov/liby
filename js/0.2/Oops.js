// at this stage no fixes or wrappers are loaded from any lib
// so you can see some dirty "cross browser" code here

if (!(/[A-Za-z\-]+\.[A-Za-z\-]+.programica.ru/.test(window.location.host)))
{
	try { console.log('Oops enabled') } catch (ex) {}
	
	function Oops (message, url, line, type)
	{
		try // to fully describe an error
		{
			var href = 'http://oops.programica.ru/report',
				esc = window.encodeURIComponent || window.escape,
				q = 'url=' + esc(url + ':' + line) + '&message=' + esc(message) + '&session=' + Oops.session + '&type=' + (type || 'error')
			
			document.createElement('img').src = '?' + q
		}
		catch (ex)
		{
			try // to scream for help
			{
				document.createElement('img').src = href + '?message=cant+report&type=error'
			}
			catch (ex) {}
		}
		
		return true
	}
	
	Oops.session = (new Date()).getTime().toString() + Math.round(Math.random() * 1E+17)
	
	window.onerror = Oops
}
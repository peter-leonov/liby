<!--# if expr="$SERVER_TYPE = /PRODUCTION/" -->

try { console.log('Programica Oops enabled') } catch (ex) {}

// at this stage no fixes or wrappers are loaded from any lib
// so you can see some dirty "cross browser" code here

function Oops (message, url, line)
{
	try
	{
		var esc = encodeURIComponent || escape
		var q = 'url=' + esc(url + ':' + line) + '&message=' + esc(message) + '&session=' + Oops.randomId + '&type=error'
		
		var img = document.createElement('img')//new Image()
		img.src = 'http://oops.programica.ru/report?' + q
 	}
	catch (ex) { window.console && window.console.log && window.console.log(ex.message) }
	
	return true
}

Oops.randomId = (new Date()).getTime().toString() + Math.round(Math.random() * 1E+17)

//alert(window.onerror)
window.onerror = Oops

<!--# endif -->
<!--# if expr="$HOST != /[A-Za-z\-]+\.[A-Za-z\-]+.programica.ru/" -->
try { console.log('Programica Oops enabled') } catch (ex) {}

// at this stage no fixes or wrappers are loaded from any lib
// so you can see some dirty "cross browser" code here

function Oops (message, url, line, type)
{
	try
	{
		var esc = self.encodeURIComponent || self.escape
		var q = 'url=' + esc(url + ':' + line) + '&message=' + esc(message) + '&session=' + Oops.randomId + '&type=' + (type || 'error')
		document.createElement('img').src = 'http://oops.programica.ru/report?' + q
 	}
	catch (ex) {  }
	
	return true
}

Oops.randomId = (new Date()).getTime().toString() + Math.round(Math.random() * 1E+17)

self.reportError = function () { Oops(Array.prototype.slice.call(arguments).join(', '), document.location.href, -1, 'reportError') }
self.onerror = Oops
<!--# endif -->
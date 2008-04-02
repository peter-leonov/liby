try { console.log('Programica Oops enabled') } catch (ex) {}

// at this stage no fixes or wrappers are loaded from any lib
// so you can see some dirty "cross browser" code here

function Oops (message, url, line)
{
	try
	{
		var esc = encodeURIComponent || escape
		var query = 'message=' + esc(url + ':' + line + ' ' + message) + ';session=' + Oops.randomId + ';type=error'
		
		var img = new Image()
		if (img)
			img.src = 'http://oops.programica.ru:8899/report?' + query
 	}
	catch (ex) { window.console && window.console.log && window.console.log(ex.message) }
	
	return true
}

Oops.randomId = (new Date()).getTime().toString() + Math.round(Math.random() * 1E+17)

//alert(window.onerror)
window.onerror = Oops
az
// window.onerror = function (a,b,c) {  }
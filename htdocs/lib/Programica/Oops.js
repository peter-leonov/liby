try { console.log('Programica Oops enabled') } catch (ex) {}

// at this stage no fixes or wrappers are loaded from any lib
// so you can see some dirty "cross browser" code here

function Oops (message, url, line)
{
	try
	{
		var img, err = message + '\n' + url + ':' + line
		
		if (document.realIECreateElement)
			img = document.realIECreateElement('img')
		else
			img = document.createElement('img')
		
		if (img)
			img.src = 'http://oops.programica.ru/report?' + (encodeURIComponent || escape)(err)
 	}
	catch (ex) { window.console && window.console.log && window.console.log(ex.message) }
	
	return true
}

Oops.randomId = (new Date()).getTime().toString() + Math.round(Math.random() * 1E+17)

//alert(window.onerror)
// window.onerror = Oops

window.onerror = function (a,b,c) {  }
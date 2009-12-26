// at this stage no fixes or wrappers are loaded from any lib

;(function(){

var report = '/oops/report?'

function Oops (message, url, line, type)
{
	try // to fully describe an error
	{
		var esc = window.encodeURIComponent || window.escape,
			q = 'v=0.3&u=' + esc(url + ':' + line) + '&m=' + esc(message) + '&s=' + Oops.session + '&t=' + (type || 'error')
		
		Oops.report(q)
	}
	catch (ex)
	{
		try // to scream for help
		{
			Oops.report('message=cant+report&type=error')
		}
		catch (ex) {}
	}
	
	return true
}

Oops.session = (new Date()).getTime().toString() + Math.round(Math.random() * 1E+17)
Oops.report = function (data)
{
	var r = new Image(1,1)
	r.src = report + data
	r.onload = function () { Oops.log('error reported successfuly') }
}

Oops.log = function (str) { try { console.log(str) } catch (ex) {} }

if (!/Oops=disabled/.test(document.cookie))
{
	Oops.log('Oops enabled')
	window.onerror = Oops
}

})();
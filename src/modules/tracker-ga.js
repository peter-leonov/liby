;(function(){

function log (str) { try { console.log(Me.className + ': ' + str) } catch (ex) {} }

if (!window._gaq)
	window._gaq = []

// As far as Tracker could be used as error reporter
// wrap everything in try/catch blocks to avoid
// infinite reporting on error in Tracker itself.

var Me =
{
	track: function (category, action, label, value)
	{
		try // to track an event
		{
			log(category + '-' + action + ': ' + label + ' (' + value + ')')
			window._gaq.push(['_trackEvent', category, action, label, value])
			return true
		}
		catch (ex)
		{
			// to warn the developer
			log('could not report a track')
		}
	}
}

Me.className = 'Tracker'
self[Me.className] = Me

})();
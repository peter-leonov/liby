;(function(){

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
			window._gaq.push(['_trackEvent', category, action, label, value])
			return true
		}
		catch (ex)
		{
			try // to warn the developer
			{
				console.log(this.className + ': could not report a track')
			}
			catch (ex)
			{
				// nothing to do
			}
		}
	}
}

Me.className = 'Tracker'
self[Me.className] = Me

})();
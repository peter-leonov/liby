;(function(){

function log (str) { try { console.log('TrackerGA: ' + str) } catch (ex) {} }

// As far as Tracker could be used as error reporter
// wrap everything in try/catch blocks to avoid
// infinite reporting on error in Tracker itself.

var Tracker =
{
	event: function (category, action, label, value)
	{
		try // to track an event
		{
			// prepare types
			category = String(category)
			action = String(action)
			label = String(label)
			value = +value || 0
			
			log(category + '-' + action + ': ' + label + ' (' + value + ')')
			GoogleAnalytics.push(['_trackEvent', category, action, label, value])
			return true
		}
		catch (ex)
		{
			// to warn the developer
			log('could not report an event')
		}
	},
	
	path: function (path)
	{
		try // to track an event
		{
			// prepare types
			path = String(path)
			
			log('path' + ': ' + path)
			GoogleAnalytics.push(['_trackPageview', path])
			return true
		}
		catch (ex)
		{
			// to warn the developer
			log('could not report a path')
		}
	}
}

self.Tracker = Tracker

})();

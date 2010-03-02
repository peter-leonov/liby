;(function(){

if (!window._gaq)
	window._gaq = []


var myName = 'Tracker'

var Me =
{
	track: function (category, action, label, value)
	{
		try
		{
			window._gaq.push(['_trackEvent', category, action, label, value])
			
			return true
		}
		catch (ex)
		{
			this.log('could not report a track')
		}
	},
	
	log: function (str) { try { console.log(myName + ': ' + str) } catch (ex) {} }
}

self.className = Me
self[myName] = Me

})();
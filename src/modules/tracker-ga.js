;(function(){

if (!window._gaq)
	window._gaq = []

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
			try
			{
				console.log(this.className + ': could not report a track')
			}
			catch (ex)
			{
				
			}
		}
	}
}

Me.className = 'Tracker'
self[Me.className] = Me

})();
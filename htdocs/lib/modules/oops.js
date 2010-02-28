// at this stage no fixes or wrappers are loaded from any lib
// except for Tracker object that hmm… tracks :)
;(function(){

function log (str) { try { console.log('Oops: ' + str) } catch (ex) {} }

var myName = 'Oops'

var Me =
{
	enabled: false,
	masking: true,
	
	onerror: function (message, url, line)
	{
		Me.report('error', url + ':' + line + ': ' + message)
		
		return Me.masking
	},
	
	report: function (type, message)
	{
		try // to fully describe an error
		{
			Tracker.track('Oops', type, message)
		}
		catch (ex)
		{
			log('could not report')
		}
		
		return true
	},
	
	maybeEnable: function ()
	{
		if (!/Oops=disabled/.test(document.cookie))
			this.enable()
	},
	
	enable: function ()
	{
		if (this.enabled)
			return
		this.enabled = true
		
		window.onerror = Me.onerror
		log('error catching enabled')
	},
	
	disable: function ()
	{
		if (!this.enabled)
			return
		this.enabled = false
		
		window.onerror = null
		log('error catching disabled')
	},
	
	log: function (message)
	{
		Tracker.track('Oops', 'log', message)
	},
	
	error: function (message)
	{
		Tracker.track('Oops', 'error', message)
	},
	
	time: function (message, time)
	{
		Tracker.track('Oops', 'time', message, time)
	}
}

self.className = Me
self[myName] = Me

})();
// at this stage no fixes or wrappers are loaded from any lib
// except for Tracker object that hmm… tracks :)
;(function(){

function log (str) { try { console.log('Oops: ' + str) } catch (ex) {} }

var myName = 'Oops'

var Me =
{
	enabled: false,
	masking: true,
	total: 0,
	
	handler: function (message, uri, line)
	{
		try
		{
			return Me.onerror.apply(Me, arguments)
		}
		catch (ex) { log('error on error reporting') }
	},
	
	onerror: function (message, uri, line)
	{
		if (typeof message == 'object')
		{
			// an event was caught
			if (message.target)
				this.report('warning', 'unable to load "' + message.target.src + '"')
		}
		else
		{
			// cutting out current page uri prefix
			if (typeof uri == 'string')
				uri = uri.replace('^' + location.protocol + '//' + location.hostname, '')
			
			this.report('error', message + ' at ' + uri + ':' + line)
		}
		
		return this.masking
	},
	
	report: function (type, message)
	{
		try // to fully describe an error
		{
			Tracker.track('Oops', type, message, this.total++)
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
		
		window.onerror = this.handler
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
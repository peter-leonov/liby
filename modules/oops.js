// at this stage no fixes or wrappers are loaded from any lib
// except for Tracker object that hmm… tracks :)
;(function(){

function log (str) { try { console.log('Oops: ' + str) } catch (ex) {} }

var Me =
{
	enabled: false,
	masking: true,
	total: 0,
	
	handler: function (message, uri, line)
	{
		try
		{
			// forward masking mode with return
			return Me.onerror.apply(Me, arguments)
		}
		catch (ex) { log('error on reporting') }
	},
	
	onerror: function (message, uri, line)
	{
		if (message && message.target)
		{
			uri = message.target.src
			message = 'Error loading script'
			line = 1
		}
		
		// cutting out current page uri prefix
		uri = String(uri).replace(location.protocol + '//' + location.hostname, '')
		
		this.report('error', message + ' at ' + uri + ':' + line)
		
		// prevent error message from appearing in the browser console
		return this.masking
	},
	
	report: function (type, message)
	{
		try // to fully describe an error
		{
			Tracker.event('Oops', type, message, this.total++)
		}
		catch (ex)
		{
			log('could not report an error')
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
		Tracker.event('Oops', 'log', message)
	},
	
	error: function (message)
	{
		Tracker.event('Oops', 'error', message)
	},
	
	time: function (message, time)
	{
		Tracker.event('Oops', 'time', message, time)
	}
}

Me.className = 'Oops'
self[Me.className] = Me

})();
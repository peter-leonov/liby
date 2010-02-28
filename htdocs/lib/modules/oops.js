// at this stage no fixes or wrappers are loaded from any lib
// except for Tracker object that hmm… tracks :)
;(function(){

var myName = 'Oops'

var Me =
{
	enabled: false,
	masking: true,
	
	onerror: function (message, url, line)
	{
		this.report('error', url + ':' + line + ': ' + message)
		
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
			this.log('could not report')
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
		this.log('error catching enabled')
	},
	
	disable: function ()
	{
		if (!this.enabled)
			return
		this.enabled = false
		
		window.onerror = null
		this.log('error catching disabled')
	},
	
	log: function (str) { try { console.log('Oops: ' + str) } catch (ex) {} }
}

self.className = Me
self[myName] = Me

})();
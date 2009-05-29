;(function(){

var myName = 'Analytics',
	empty = function () {},
	error = function () { throw new Error(myName + ' currently is not in right state') }

function job (name) { return function () { this.jobs.push([name, arguments]) } }

var Me = self[myName] =
{
	jobs: [],
	
	state: null,
	states:
	{
		init:
		{
			load: function (account)
			{
				this.account = account
				$.include(('https:' == document.location.protocol ? 'https://ssl.' : 'http://www.') + 'google-analytics.com/ga.js')
				this.setState('loading')
				
				var me = this, timer
				function check ()
				{
					// log('check')
					if (self._gat)
					{
						clearInterval(timer)
						me.setState('ready')
						me.loaded()
					}
				}
				timer = setInterval(check, 250)
			},
			exec: error,
			track: error
		},
		
		loading:
		{
			load: empty,
			exec: job('exec'),
			track: job('track')
		},
		
		ready:
		{
			load: empty,
			loaded: function ()
			{
				this.tracker = _gat._getTracker(this.account)
				
				this.doJobs()
			},
			exec: function (func) { func.apply(this) },
			track: function () { this.tracker._trackPageview.apply(this.tracker, arguments) }
		}
	},
	
	doJobs: function ()
	{
		var jobs = this.jobs
		for (var i = 0; i < jobs.length; i++)
		{
			var job = jobs[i]
				meth = this[job[0]]
			if (meth)
				meth.apply(this, job[1])
			else
				throw new Error('method "' + job[0] + '" is undefined')
		}
	},
	
	setState: function (name)
	{
		// log('setState', name)
		var state = this.states[name]
		if (state)
		{
			this.state = name
			Object.extend(this, state)
		}
		else
			throw new Error(myName + ': now such state "' + name + '"')
	}
}

// // a few tests
// var error
// try { Me.track() } catch (ex) { error = true }
// log(error ? 'ok' : 'fail')
// 
// Me.setState('loading')
// error = false
// try { Me.track() } catch (ex) { error = true }
// log(!error ? 'ok' : 'fail')

Me.setState('init')


})();
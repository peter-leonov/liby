;(function(){

var s = self

if (s.log)
	return

if (s.console && s.console.log) // native console.log() present
{
	if (s.console.log.apply)
	{
		s.log = function () { s.console.log.apply(s.console, arguments) }
	}
	else
	{
		s.log = s.console.log
		try
		{
			s.log('test call to log()')
		}
		catch (ex)
		{
			s.log = function () { s.console.log(arguments) }
		}
	}
}
else // none
{
	s.log = function () {}
}

})();
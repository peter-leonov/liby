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
else if (s.opera && s.opera.postError) // Opera < 10.5
{
	s.log = function () { return s.opera.postError(arguments) }
}
else // none
{
	s.log = function () {}
}

})();
;(function(){

var s = self

if (!s.log)
{
	// console object present
	if (s.console)
		s.log = function () { s.console.log.apply(s.console, arguments) }
	
	// Opera
	else if (s.opera && s.opera.postError)
		s.log = function () { return s.opera.postError(arguments) }
	
	// none
	else
		s.log = function () {}
}

})();
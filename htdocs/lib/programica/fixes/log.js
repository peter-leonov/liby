;(function(){

var s = self

if (!s.log)
{
	// Firebug
	if (s.console && s.console.firebug)
		s.log = console.log
	
	// Opera
	else if (s.opera && s.opera.postError)
		s.log = function () { return s.opera.postError(arguments) }
	
	// other consoles
	else if (s.console && s.console.log)
		s.log = function () { return s.console.log(Array.prototype.slice.call(arguments).join(', ')) }
	
	// none
	else
		s.log = function () {}
}

})();
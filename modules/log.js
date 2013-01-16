;(function(){

if (self.log)
	return

self.log = function ()
{
	try
	{
		console.log.apply(console, arguments)
	}
	catch (ex) {}
}

})();

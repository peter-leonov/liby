(function(){

var doc = document

// based on jQuery onready for IE
// based on the trick by Diego Perini (http://javascript.nwbox.com/IEContentLoaded/)
function checkready ()
{
	try { doc.documentElement.doScroll("left") }
	catch (ex) { return }
	
	clearInterval(checkready.interval)
	
	// IE8 gain native support for Element.prototype
	// so __fixNodes is no more needed
	if (doc.__fixNodes)
		// IE 6-7
		doc.__fixNodes(doc.all)
	
	if (self.$)
		self.$.onready.run()
}
checkready.interval = setInterval(checkready, 100)

})();
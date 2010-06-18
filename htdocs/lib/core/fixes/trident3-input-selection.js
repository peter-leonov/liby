;(function(){

// selection logic from:
// http://www.webdeveloper.com/forum/showthread.php?t=74982

var selection = document.selection

function setter ()
{
	var e = event,
		node = e.srcElement,
		name = e.propertyName,
		value = node[e.propertyName]
	
	if (name == 'selectionStart')
	{
		// jump to the end
		node.focus()
		
		var sel = selection.createRange()
		
		// jump to the begin
		sel.moveStart('character', -node.value.length)
		
		// jump to set postion
		sel.moveStart('character', value)
		sel.moveEnd('character', 0)
		sel.select()
	}
}

HTMLInputElement.__pmc_fixHook = function (node)
{
	node.attachEvent('onpropertychange', setter)
}

})();

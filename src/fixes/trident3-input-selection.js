;(function(){

// selection logic is a compilation of:
// http://www.webdeveloper.com/forum/showthread.php?t=74982
// http://javascript.nwbox.com/cursor_position/
// http://msdn.microsoft.com/en-us/library/ms536620(v=VS.85).aspx

var selection = document.selection,
	Me = HTMLInputElement

function updateSelection (node)
{
	// jump to the input if not already in it
	node.focus()
	
	// create a range within the input
	var r = selection.createRange()
	
	// move start and end to the begin of the input
	r.moveStart('character', -100000)
	r.collapse()
	
	// get values of the emulated properties
	var start = node.selectionStart,
		end = node.selectionEnd
	
	// set current position
	r.moveStart('character', start)
	r.moveEnd('character', end - start)
	r.select()
}

function updateProperties (node)
{
	internal = true
	
	// create a range copy
	var r = selection.createRange().duplicate()
	
	// move start to the begin of the input
	r.moveStart('character', -100000)
	
	node.selectionEnd = r.text.length
	
	
	// create a range copy
	var r = selection.createRange().duplicate()
	
	// move end to start
	r.collapse()
	
	// move start to the begin of the input
	r.moveStart('character', -100000)
	
	node.selectionStart = r.text.length
	
	internal = false
}

var internal = false

function setter ()
{
	if (internal)
		return
	internal = true
	
	var e = event,
		node = e.srcElement,
		name = e.propertyName,
		v = node[e.propertyName]
	
	if (name == 'value')
	{
		var len = v.length
		node.selectionStart = len
		node.selectionEnd = len
	}
	else if (name == 'selectionStart')
	{
		v >>= 0
		if (v < 0)
			v = 0
		else
		{
			var len = node.value.length
			if (v > len)
				v = len
		}
		
		node.selectionStart = v
		
		if (v > node.selectionEnd)
			node.selectionEnd = v
		
		try
		{
			updateSelection(node)
		}
		catch (ex) { setTimeout(function () { throw ex }, 10) }
	}
	else if (name == 'selectionEnd')
	{
		v >>= 0
		if (v < 0)
			v = 0
		else
		{
			var len = node.value.length
			if (v > len)
				v = len
		}
		
		node.selectionEnd = v
		
		if (v < node.selectionStart)
			node.selectionStart = v
		
		try
		{
			updateSelection(node)
		}
		catch (ex) { setTimeout(function () { throw ex }, 10) }
	}
	
	internal = false
}


Me.__pmc_fixHook = function (node)
{
	node.attachEvent('onpropertychange', setter)
	
	function update () { updateProperties(node) }
	function updateDelayed () { setTimeout(function () { updateProperties(node) }, 0) }
	
	node.addEventListener('keypress', updateDelayed, false)
	node.addEventListener('mousedown', updateDelayed, false)
	node.addEventListener('mouseup', updateDelayed, false)
	node.addEventListener('click', updateDelayed, false)
	node.addEventListener('select', updateDelayed, false)
	node.addEventListener('focus', updateDelayed, false)
}

Me.prototype.selectionStart = 0
Me.prototype.selectionEnd = 0

})();

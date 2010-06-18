;(function(){

// selection logic from:
// http://www.webdeveloper.com/forum/showthread.php?t=74982

var selection = document.selection,
	Me = HTMLInputElement

function setStart (node, pos)
{
	// jump to the end
	node.focus()
	
	var sel = selection.createRange()
	
	// jump to the begin
	sel.moveStart('character', -node.value.length)
	
	// jump to set postion
	sel.moveStart('character', pos)
	sel.moveEnd('character', 0)
	sel.select()
}

function setEnd (node, pos)
{
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
			setStart(node, v)
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
			setEnd(node, v)
		}
		catch (ex) { setTimeout(function () { throw ex }, 10) }
	}
	
	internal = false
}

Me.__pmc_fixHook = function (node)
{
	node.attachEvent('onpropertychange', setter)
}

Me.prototype.selectionStart = 0
Me.prototype.selectionEnd = 0

})();

;(function(){

var selection = document.selection,
	Me = HTMLInputElement

// var internal = false

var selectionStart =
{
	get: function ()
	{
		// create a range copy
		var r = selection.createRange().duplicate()
		
		// move end to start
		r.collapse()
		
		// move start to the begin of the input
		r.moveStart('character', -100000)
		
		return r.text.length
	},
	
	set: function (v)
	{
		// jump to the input if not already in it
		this.focus()
		
		// create a range within the input
		var r = selection.createRange()
		
		// move start and end to the begin of the input
		r.moveStart('character', v - this.selectionStart)
		r.select()
	}
}

var selectionEnd =
{
	get: function ()
	{
		// create a range copy
		var r = selection.createRange().duplicate()
		
		// move start to the begin of the input
		r.moveStart('character', -100000)
		
		return r.text.length
	},
	
	set: function (v)
	{
		// jump to the input if not already in it
		this.focus()
		
		// create a range within the input
		var r = selection.createRange()
		
		// move start and end to the begin of the input
		r.moveEnd('character', v - this.selectionEnd)
		r.select()
	}
}

Object.defineProperty(Me.prototype, "selectionStart", selectionStart)
Object.defineProperty(Me.prototype, "selectionEnd", selectionEnd)

})();

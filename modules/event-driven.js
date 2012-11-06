;(function(){

var myName = 'EventDriven',
	Me = self[myName] = function () {},
	handlersProp = '__' + myName + 'Handlers',
	doc = document

Me.prototype =
{
	addEventListener: function (type, listener, capture)
	{
		var handlers, harr
		if (handlers = this[handlersProp])
		{
			if (harr = handlers[type])
				harr.indexOf(listener) < 0 ? harr.push(listener) : 1
			else
				handlers[type] = [listener]
		}
		else
			(this[handlersProp] = {})[type] = [listener]
	},
	
	removeEventListener: function (type, listener, capture)
	{
		var handlers = this[handlersProp]
		if (!handlers)
			return
		
		var harr = handlers[type]
		if (!harr)
			return
		
		var i = harr.indexOf(listener)
		if (i == -1)
			return
		
		harr.splice(i, 1)
	},
	
	dispatchEvent: function (type, e)
	{
		e.__dispatched = true
		
		e.type = type
		
		var handlers = this[handlersProp]
		if (!handlers)
			return true
		
		var harr = handlers[e.type]
		if (!harr)
			return true
		
		var len = harr.length
		if (!len)
			return true
		
		for (var i = 0; i < len; i++)
			harr[i].call(this, e)
		
		return !e.defaultPrevented
	}
}

function Event () {}

Event.prototype =
{
	bubbles: true,
	cancelable: true,
	
	preventDefault: function ()
	{
		if (this.__dispatched && this.cancelable)
			this.defaultPrevented = true
	},
	
	stopPropagation: function ()
	{
		this.propagationStopped = true
	},
	
	initEvent: function (type, bubbles, cancelable)
	{
		this.type = type
		this.bubbles = bubbles
		this.cancelable = cancelable
	}
}

Me.Event = Event

})();

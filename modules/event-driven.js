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
		var handlers, harr, i, len
		if (handlers = this[handlersProp])
			if ((harr = handlers[type]))
			{
				if ((i = harr.indexOf(listener)) >= 0)
				{
					for (len = harr.length; i < len; i++)
						harr[i] = harr[i + 1]
					harr.length--
				}
			}
	},
	
	dispatchEvent: function (e)
	{
		e.__dispatched = true
		var handlers, harr, len
		if ((handlers = this[handlersProp]))
			if ((harr = handlers[e.type]))
				if ((len = harr.length))
				{
					for (var i = 0; i < len; i++)
						harr[i].call(this, e)
					return !e.defaultPrevented
				}
		
		return true
	},
	
	dispatchEventData: function (type, data)
	{
		var e = new Event()
		e.type = type
		e.data = data
		return this.dispatchEvent(e)
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

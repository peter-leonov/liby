// EventDriven
;(function(){

var myName = 'EventDriven',
	Me = self[myName] = Module(myName)
	MyEvent = Me.Event = Class(myName + '.Event')

MyEvent.prototype = 
{
	eventPhase: 2,
	bubbles: false,
	cancelable: true,
	
	initialize: function (target)
	{
		this.timeStamp = +new Date()
		this.currentTarget = this.target = target
	},
	
	stopPropagation: function () {},
	preventDefault: function () { this._preventedDefault = true },
	initEvent: function () {}
}

// var cache = Me.cache = {}

function uselessDispatchEvent () { return true }

function usefullDispatchEvent (e, data)
{
	var event = new MyEvent(this)
	
	if (typeof e == 'string')
	{
		event.type = e
		event.data = data || {}
	}
	else
		Object.extend(event, e)
	
	var handlers, harr, i, ret = true
	if (handlers = this.__EventDrivenHandlers)
		if (harr = handlers[event.type])
			for (i = 0, len = harr.length; i < len; i++)
				harr[i].call(this, event)
	
	return !event._preventedDefault
}

// event = document.createEvent("Event")
// event.initEvent(type, bubbles, cancelable)
// node.dispatchEvent(event)

Me.prototype =
{
	addEventListener: function (type, listener, capture)
	{
		var handlers, harr
		if (handlers = this.__EventDrivenHandlers)
		{
			if (harr = handlers[type])
				harr.indexOf(listener) < 0 ? harr.push(listener) : 1
			else
				handlers[type] = [listener]
		}
		else
			(this.__EventDrivenHandlers = {})[type] = [listener]
		
		this.dispatchEvent = usefullDispatchEvent
	},

	removeEventListener: function (type, listener, capture)
	{
		var handlers, harr, i, k, count
		if (handlers = this.__EventDrivenHandlers)
			if (harr = handlers[type])
			{
				if ((i = harr.indexOf(listener)) >= 0)
				{
					for (len = harr.length; i < len; i++)
						harr[i] = harr[i + 1]
					harr.length--
					
					count = 0
					for (k in handlers)
						count += handlers[k].length
					
					if (!count)
						this.dispatchEvent = uselessDispatchEvent
				}
			}
	},
	
	dispatchEvent: uselessDispatchEvent
}

})();

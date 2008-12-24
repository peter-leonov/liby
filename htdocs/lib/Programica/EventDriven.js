// EventDriven
;(function(){

var myName = 'EventDriven'
var Me = self[myName] = Module(myName)

// var cache = Me.cache = {}

function uselessDispatchEvent () {}

function usefullDispatchEvent (e, data)
{
	if (typeof e == 'string')
		e = {type: e, data: data || {}, timeStamp: +new Date}
	
	var handlers, harr, i, ret = true
	if (handlers = this.__EventDrivenHandlers)
		if (harr = handlers[e.type])
			for (i = 0, len = harr.length; i < len; i++)
				if (harr[i].call(this, e) === false)
					ret = false
	
	return ret
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

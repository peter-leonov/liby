;(function(){

var myName = 'EventTarget',
	Me = self[myName] = Module(myName),
	handlersProp = '__' + myName + 'Handlers',
	doc = document

function preventDefault ()
{
	this.defaultPrevented = true
}

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
		var handlers, harr, i
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
		var handlers, harr, len
		if ((handlers = this[handlersProp]))
			if ((harr = handlers[e.type]))
				if ((len = harr.length))
				{
					e.preventDefault = preventDefault
					for (var i = 0; i < len; i++)
						try { harr[i].call(this, e) }
						catch (ex) { log(ex) }
					delete e.preventDefault
					return !e.defaultPrevented
				}
		
		return true
	},
	
	dispatchEventData: function (type, data)
	{
		var e = doc.createEvent('Event')
		e.initEvent(type, true, true)
		e.data = data
		return this.dispatchEvent(e)
	}
}

})();

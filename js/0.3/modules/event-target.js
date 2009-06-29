;(function(){

var myName = 'EventTarget',
	Me = self[myName] = Module(myName),
	handlersProp = '__' + myName + 'Handlers',
	doc = document, undef

// that is for FF, thinking bad about it...
{
	var eventClasses = [self.Event, self.UIEvent, self.MouseEvent, self.KeyboardEvent, self.MutationEvent]

	function preventDefault ()
	{
		this.__pmc__preventDefault()
		this.defaultPrevented = true
	}

	for (var i = 0; i < eventClasses.length; i++)
	{
		var cl = eventClasses[i]
		if (cl)
		{
			var proto = cl.prototype
			if (proto && proto.preventDefault !== preventDefault)
			{
				proto.__pmc__preventDefault = proto.preventDefault
				proto.preventDefault = preventDefault
			}
		}
	}
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
	
	dispatchEvent: function (e, data)
	{
		e.defaultPrevented = false
		var handlers, harr, len
		if ((handlers = this[handlersProp]))
			if ((harr = handlers[e.type]))
				if ((len = harr.length))
				{
					for (var i = 0; i < len; i++)
						try { harr[i].call(this, e) }
						catch (ex) { log(ex) }
					
					return !e.defaultPrevented
				}
				else
					return true
	},
	
	dispatchEventData: function (type, data)
	{
		var e = doc.createEvent()
		e.initEvent(type)
		if (data !== undef)
			e.data = data
		
		return this.dispatchEvent(e)
	}
}

})();

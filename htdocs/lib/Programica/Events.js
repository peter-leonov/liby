//——————————————————————————————————————————————————————————————————————————————
// Простая событийная модель

if (!self.Programica.Abstract) Programica.Abstract = {}
Programica.Abstract.Events = function () {  }


with (Programica.Abstract.Events.Event = function () {})
{
	prototype.stopPropogation = function () { return this.cancelBubble = true }
}

// событийная модель
Object.extend (Programica.Abstract.Events.prototype,
{
	// распространяем событие
	dispatchEvent: function (eventName)
	{
		if (this['on' + eventName]) this['on' + eventName].call(this, eventName)
		
		if (this.pmcEvents && this.pmcEvents[eventName])
			for (var i = 0; i < this.pmcEvents[eventName].length; i++)
				if (this.pmcEvents[eventName][i])
				{
					if (this.cancelBubble) return true
					this.pmcEvents[eventName][i].call(this, eventName)
				}
		
		return true
	},
	
	// сейчас параметр capture везде всего лишь декорация
	
	// добавляем обработчик
	addEventListener: function (eventName, handler, capture)
	{
		if (this.searchEventListenerIndex(eventName, handler, capture) >= 0) return handler
		
		if (this.pmcEvents[eventName])
			this.pmcEvents[eventName].push(handler)
		else
			this.pmcEvents[eventName] = [handler]
		
		return handler
	},
	
	// ищем индекс обработчика
	searchEventListenerIndex: function (eventName, handler, capture)
	{
		if (this.pmcEvents[eventName])
			for (var i = 0; i < this.pmcEvents[eventName].length; i++)
				if (this.pmcEvents[eventName][i] == handler)
					return i
		
		return -1
	},
	
	// ищем функцию обработчика
	searchEventListener: function (eventName, handler, capture)
	{
		var n = this.searchEventListenerIndex(eventName, handler, capture)
		if (n < 0) return null
		
		return this.pmcEvents[eventName][n]
	},
	
	// удаляем обработчик
	removeEventListener: function (eventName, handler, capture)
	{
		var n = this.searchEventListenerIndex(eventName, handler, capture)
		if (n < 0) return false
		
		delete this.pmcEvents[eventName][n]
		return false
	}
})

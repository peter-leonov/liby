
// Сборник обстранктных классов


//——————————————————————————————————————————————————————————————————————————————
// «объектно ориентированные» «именованные» таймеры

Programica.Abstract.Timer = function () {/*пока пусто*/}

Programica.Abstract.Timer.prototype =
{
	/*intervals: {},
	timeouts: {},*/
	
	// создает таймер
	setTimeout: function (timeoutName, func, interval)
	{
		this.clearTimeout(timeoutName)
		
		return this.timeouts[timeoutName] = setTimeout(func, interval)
	},

	// отменяет и удаляет таймер
	clearTimeout: function (timeoutName)
	{
		if (this.timeouts[timeoutName])
		{
			clearTimeout(this.timeouts[timeoutName])
			delete this.timeouts[timeoutName]
			this.running = false
			
			return true
		}
		else
			return false
	},
	
	// создает интервал
	setInterval: function (intervalName, func, interval)
	{
		this.clearInterval(intervalName)
		
		return this.intervals[intervalName] = setInterval(func, interval)
	},

	// отменяет и удаляет интервал
	clearInterval: function (intervalName)
	{
		if (this.intervals[intervalName])
		{
			clearInterval(this.intervals[intervalName])
			delete this.intervals[intervalName]
			this.running = false
			
			return true
		}
		else
			return false
	}
}



//——————————————————————————————————————————————————————————————————————————————
// Простая событийная модель


Programica.Abstract.EventedObject  = function (prms)
{
	// пока пусто
}

Programica.Abstract.EventedObject.prototype = new Programica.Abstract.Timer ()

// событийная модель
extend (Programica.Abstract.EventedObject.prototype,
{
	// распространяем событие
	dispatchEvent: function (eventName)
	{
		if (this.pmcEvents[eventName])
			for (var i in this.pmcEvents[eventName])
				if (this.pmcEvents[eventName][i])
					if (!this.pmcEvents[eventName][i].call(this,eventName))
						return false
		
		return true
	},
	
	// параметр capture сейчас везде всего лишь декорация
	
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
			for (var i in this.pmcEvents[eventName])
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

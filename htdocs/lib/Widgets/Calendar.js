
Programica.Calendar = function () {}

Programica.Calendar.prototype = new Programica.Widget()
Programica.Calendar.prototype.mainNodeClassName = 'programica-calendar'
Programica.Calendar.prototype.klass = 'Programica.Calendar'
Programica.Calendar.prototype.Handler = function (node)
{
	this.mainNode = node
}

Programica.Calendar.prototype.Handler.prototype =
{
	init: function ()
	{
		this.curDateNode = $('calendarMonth');//this.my('current-date')[0]
		
		var r = sGet(this.mainNode.getAttribute('calendar-href'))
		this.dataLoaded(r)
	},
	
	my: function (cn) { return this.mainNode.getElementsByClassName(this.ns ? (this.ns + "-" + cn) : cn) },
	
	dataLoaded: function (r)
	{
		this.request = r
		this.draw()
		//var t = this
		//setTimeout(function () { t.draw() }, 10)
	},
	
	
	// наполняет базовую ноду юлками и лишками
	draw: function ()
	{
		var data = this.parce(this.request.responseXML())
		
		var today = new Date();
		
		var now = new Date(0)
		now.setFullYear(2007,3,1)
		var end = new Date(0)
		end.setFullYear(2008,1,1)
		
		var last = new Date(now)
		last.setDate(last.getDate() - 1)
		
		
		while (now <= end)
		{
			var ul = document.createElement('ul')
			ul.className = 'days point'
			this.mainNode.appendChild(ul)
			
			if (now.getYear() == today.getYear() && now.getMonth() == today.getMonth())
				ul.className += ' selected'
			
			// и снова гемор с замыканиями
			ul.onselect = (function (t, d) { return function () { t.curDateNode.innerHTML = d.rusMY() } })(this, now)
			
			var i = 0
			
			for (i; i < last.getDay(); i++)
			{
				var li = ul.appendChild(document.createElement('li'))
				li.className = 'nondate'
				li.innerHTML = '&nbsp;'
			}
			
			do
			{
				i++
				var li = ul.appendChild(document.createElement('li'))
				li.innerHTML = now.getDate()
				
				
				// пока раскрашиваем ноды тут, но надо вынесли логику
				if (today < now) // будущее
				{
					if (data[now])
					{
						li.className = 'future private'
						li.onmouseup = function () { content.show('#content-event') }
					}
					else
					{
						li.className = "future freeday"
						li.onmouseup = function () { content.show('#content-freeday') }
					}
				}
				else if (today == now) // настоящее
				{
					
				}
				else if (today > now) // прошлое
				{
					li.onmouseup = function () { content.show('#content-past') }
					
					if (data[now])
					{
						li.className = 'past private'
					}
					else
					{
						li.className = "past freeday"
					}
				}
				
				last = now
				now = new Date(now)
				now.setDate(now.getDate() + 1)
			}
			while (last.getMonth() == now.getMonth())
			
			if (last.getDay())
				for (i = 0; i < 7 - last.getDay(); i++)
				{
					var li = ul.appendChild(document.createElement('li'))
					li.className = 'nondate'
					li.innerHTML = '&nbsp;'
				}
			
			//now.setMonth(now.getMonth() + 1)
			//log("month: " + now + " " + end)
		}
		
		//log(data)
	},
	
	
	// разбирает XML в хеш
	parce: function (root)
	{
		var data = {}
		
		// года
		var years = root.getElementsByTagName('year')
		for (var yi = 0; yi < years.length; yi++)
		{
			var y = years[yi]
			var ynum = y.getAttribute('num')
			
			// месяца
			var months = y.getElementsByTagName('month')
			for (var mi = 0; mi < months.length; mi++)
			{
				m = months[mi]
				var mnum = m.getAttribute('num')
				
				// дни
				var days = m.getElementsByTagName('day')
				for (var di = 0; di < days.length; di++)
				{
					var d = days[di]
					var dnum = d.getAttribute('num')
					
					var date = new Date(0)
					date.setFullYear(ynum, mnum - 1, dnum)
					
					//log(ynum + "-" + mnum + "-" + dnum + ": " + date.iso() + date)
					data[date] = d
				}
			}
		}
		
		/*var options = root.getElementsByTagName('options')[0]
		
		var begin_str = new String(options.getAttribute('begin'))
		var begin_arr = begin_str.split();
		
		var begin = new Date(0)
		var end = new Date(0)*/
		
		return data /*{data:data, begin:begin, end:end}*/
	}
}

Programica.Widget.register(new Programica.Calendar())

Date.rusMonths = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь']

Date.prototype.rusMY = function ()
{
	return Date.rusMonths[this.getMonth()] + ", " + this.getFullYear()
}
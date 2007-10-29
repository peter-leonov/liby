
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
		this.curDateNode = $(this.mainNode.getAttributeNS(Programica.ns070909, 'calendar-selected-month')) || this.my('selected-month')[0]
		this.riNs = this.mainNode.getAttributeNS(Programica.ns070909, 'calendar-ri-ns')
		
		var r = sGet(this.mainNode.getAttributeNS(Programica.ns070909, 'calendar-href'))
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
		var data = this.parse(this.request.responseXML())
		
		var today = new Date()//new Date() - 10000000000);
		today.setHours(3)
		today.setMinutes(0)
		today.setSeconds(0)
		today.setMilliseconds(0)
		
		var now = data.begin
		var end = data.end
		
		var last = new Date(now)
		last.setDate(last.getDate() - 1)
		
		while (now <= end)
		{
			var ul = document.createElement('ul')
			ul.addClassName('days ' + (this.riNs ? (this.riNs + '-point') : 'point'))
			//ul.setAttribute('className', 'days ' + (this.riNs ? (this.riNs + '-point') : 'point'))
			
			if (now.getYear() == today.getYear() && now.getMonth() == today.getMonth())
				ul.addClassName(this.riNs ? (this.riNs + '-selected') : 'selected')
			
			// и снова гемор с замыканиями
			ul.onselect = function (t, d) { return function () { if (t.curDateNode) t.curDateNode.innerHTML = d.rusMY() } } (this, now)
			
			var i = 0
			
			for (i; i < last.getDay(); i++)
			{
				var li = ul.appendChild(document.createElement('li'))
				li.addClassName('nondate')
				li.innerHTML = ' '
				//li.appendChild(document.createTextNode('asd'))
			}
			
			do
			{
				i++
				var li = ul.appendChild(document.createElement('li'))
				li.innerHTML = now.getDate()
				
				// пока раскрашиваем ноды тут, но логику надо бы вынести
				if (today < now) // будущее
				{
					if (data[now])
						li.addClassName('future private')
					else
						li.addClassName('future freeday')
				}
				else if (today.getTime() == now.getTime()) // настоящее
				{
					if (data[now])
						li.addClassName('curdate private')
					else
						li.addClassName('curdate freeday')
				}
				else if (today > now) // прошлое
				{
					if (data[now])
						li.addClassName('past private')
					else
						li.addClassName('past freeday')
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
					li.addClassName('nondate')
					li.innerHTML = ' '
				}
			
			this.mainNode.appendChild(ul)
			
			//now.setMonth(now.getMonth() + 1)
			//log("month: " + now + " " + end)
		}
		
		//log(this.mainNode.innerHTML)
		
		//log(data)
	},
	
	
	// разбирает XML в хеш
	parse: function (root)
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
		
		var opts = root.getElementsByTagName('options')[0]
		
		data.begin = new Date(opts.getAttribute('begin') + ' 03:00:00')
		data.end = new Date(opts.getAttribute('end') + ' 03:00:00')
		//alert(new Date('Sep 12 2007 19:14:52'))
		return data
	}
}

Programica.Widget.register(new Programica.Calendar())

Date.rusMonths = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь']

Date.prototype.rusMY = function ()
{
	return Date.rusMonths[this.getMonth()] + ", " + this.getFullYear()
}

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
		var r = sGet(this.mainNode.getAttribute('calendar-href'))
		this.dataLoaded(r)
	},
	
	dataLoaded: function (r)
	{
		this.request = r
		this.draw()
		//var t = this
		//setTimeout(function () { t.draw() }, 10)
	},
	
	draw: function ()
	{
		var data = this.parce(this.request.responseXML())
		
		var now = new Date(0)
		now.setFullYear(2007,4-1)
		var end = new Date(0)
		end.setFullYear(2008,2-1)
		
		var last = new Date(now)// - 86200000
		last.setDate(last.getDate() - 1)
		//alert(now + ":" + last)
		
		while (now <= end)
		{
			var ul = document.createElement('ul')
			ul.className = 'days point'
			this.mainNode.appendChild(ul)
			
			var i
			
			for (i = 0; i < last.getDay(); i++)
			{
				var li = ul.appendChild(document.createElement('li'))
				li.innerHTML = '&nbsp;'
			}
			
			do
			{
				i++
				var li = ul.appendChild(document.createElement('li'))
				li.innerHTML = now.getDate()
				
				last = now
				now = new Date(now)// * 1 + 86200000
				now.setDate(now.getDate() + 1)
				//log(now + ":::" + last)
				//now.setDate(now.getDate() + 1)
			}
			while (last.getMonth() == now.getMonth())
			
			for (i = 0; i < 7 - last.getDay(); i++)
			{
				var li = ul.appendChild(document.createElement('li'))
				li.innerHTML = '&nbsp;'
			}
			
			//now.setMonth(now.getMonth() + 1)
			//log("month: " + now + " " + end)
		}
		
		//log(data)
	},
	
	parce: function (root)
	{
		var data = {}
		
		// руками раскладываем XML в хеш
		var years = root.getElementsByTagName('year')
		for (var yi = 0; yi < years.length; yi++)
		{
			var y = years[yi]
			var ynum = y.getAttribute('num')
			
			var months = y.getElementsByTagName('month')
			for (var mi = 0; mi < months.length; mi++)
			{
				m = months[mi]
				var mnum = m.getAttribute('num')
				
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


Date.prototype.fixZ = function (d) { if (d == 0) return "00"; if (d < 10) return "0" + d; return d }

Date.prototype.iso = function ()
{
	// тупо, но быстро :)
	with (this)
		return (1900 + getYear()) + "-" + fixZ(getMonth()+1) + "-" + fixZ(getDate()) + " " + fixZ(getHours()) + ":" + fixZ(getMinutes()) + ":" + fixZ(getSeconds())
}
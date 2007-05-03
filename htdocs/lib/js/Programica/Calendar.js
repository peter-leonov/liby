
Programica.Calendar = function () {}

Programica.Calendar.prototype.Handler = function (node)
{
	this.mainNode = node
}

Programica.Calendar.prototype.Handler.prototype =
{
	init: function ()
	{
		var t = this
		aGet(this.mainNode.getAttribute('calendar-href')).onLoad = function ()
		{
			t.dataLoaded(this)
		}
	},
	
	dataLoaded: function (r)
	{
		this.request = r
		
		var t = this
		setTimeout(function () { t.draw() }, 10)
	},
	
	draw: function ()
	{
		var data = this.parce(this.request.responseXML())
		
		with (this.mainNode)
			for (var ul = 0; ul < 6; ul++)
				with(appendChild(document.createElement('ul')))
				{
					className = 'days point'
					//setAttribute('class', 'point')
					for (var li = 1; li <= 42; li++)
					{
						with(appendChild(document.createElement('li')))
							innerHTML = li
					}
				}
		
		log(data)
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
		
		return data
	}
}

Date.prototype.fixZ = function (d) { if (d == 0) return "00"; if (d < 10) return "0" + d; return d }

Date.prototype.iso = function ()
{
	// тупо, но быстро :)
	with (this)
		return (1900 + getYear()) + "-" + fixZ(getMonth()+1) + "-" + fixZ(getDate()) + " " + fixZ(getHours()) + ":" + fixZ(getMinutes()) + ":" + fixZ(getSeconds())
}
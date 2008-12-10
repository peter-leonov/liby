
// 1, 2, 5: банкир, банкира, банкиров
String.prototype.plural = Number.prototype.plural = function (a, b, c)
{
	if (this % 1)
		return b
	
	var v = Math.abs(this) % 100
	if (11 <= v && v <= 19)
		return c
	
	v = v % 10
	if (2 <= v && v <= 4)
		return b
	if (v == 1)
		return a
	
	return c
}

Date.rusMonths = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь']
Date.rusMonths2 = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря']
Date.prototype.toRusDate = function () { return this.getDate() + ' ' + Date.rusMonths2[this.getMonth()] + ' ' + this.getFullYear() }

Humanize =
{
	adjustTextSize: function (nodes)
	{
		for (var i = 0; i < nodes.length; i++)
		{
			var node = nodes[i]
			
			if (node.scrollWidth > node.offsetWidth)
			{
				var text = node.firstChild,
					string = text.nodeValue
				node.realText = string
				text.nodeValue = string.substr(0, 16) + '…'
				node.title = string
			}
		}
	},
	
	adjustTextSizeOfNodes: function (root, selector)
	{
		var me = this
		setTimeout(function () { me.adjustTextSize(cssQuery(selector, root)) }, 1)
	}
}
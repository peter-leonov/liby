;(function(){

var map =
{
	s: 'second',
	m: 'minute',
	h: 'hour',
	d: 'day',
	w: 'week',
	y: 'year'
}

var DateDiff =
{
	second: 1000,
	minute: 6e4,
	hour: 36e5,
	day: 864e5,
	week: 7 * 864e5,
	year: 365 * 864e5,
	
	parse: function (str)
	{
		var m = /^([+-])?(\d+(?:\.\d+)?)([smhdwy])?$/.exec(str)
		if (!m)
			return null
		
		return [m[1] || '+', +m[2], map[m[3] || 's']]
	},
	
	compute: function (diff)
	{
		var s = Math.round(diff[1] * DateDiff[diff[2]])
		return diff[0] == '-' ? -s : s
	},
	
	add: function (date, str)
	{
		return new Date(+date + DateDiff.compute(DateDiff.parse(str)))
	}
}

Liby.DateDiff = DateDiff

})();

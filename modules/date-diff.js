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

function DateDiff () {}

DateDiff.second = 1000
DateDiff.minute = 6e4
DateDiff.hour = 36e5
DateDiff.day = 864e5
DateDiff.week = 7 * 864e5
DateDiff.year = 365 * 864e5

DateDiff.addStatics
(
function parse (str)
{
	var m = /^([+-])?(\d+(?:\.\d+)?)([smhdwy])?$/.exec(str)
	if (!m)
		return null
	
	return [m[1] || '+', +m[2], map[m[3] || 's']]
},

function compute (diff)
{
	var s = Math.round(diff[1] * DateDiff[diff[2]])
	return diff[0] == '-' ? -s : s
},

function add (date, str)
{
	return new Date(+date + DateDiff.compute(DateDiff.parse(str)))
}
)

Liby(DateDiff)

})();

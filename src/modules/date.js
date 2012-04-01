;(function(){

var D = Date

D.second = 1000
D.minute = 6e4
D.hour = 36e5
D.day = 864e5
D.week = 7 * 864e5
D.year = 365 * 864e5

if (!D.now)
	D.now = function () { return +new D() }

var map =
{
	s: 'second',
	m: 'minute',
	h: 'hour',
	d: 'day',
	w: 'week',
	y: 'year'
}

D.parseDiff = function (str)
{
	var m = /^([+-])?(\d+(?:\.\d+)?)([smhdwy])?$/.exec(str)
	if (!m)
		return null
	
	return [m[1] || '+', +m[2], map[m[3] || 's']]
}

D.computeDiff = function (diff)
{
	var s = Math.round(diff[1] * D[diff[2]])
	return diff[0] == '-' ? -s : s
}

D.prototype.add = function (str)
{
	return new Date(+this + D.computeDiff(D.parseDiff(str)))
}

D.add = function (str)
{
	return new D().add(str)
}

})();
;(function(){

var D = Date

D.second = 1000
D.minute = 6e4
D.hour = 36e5
D.day = 864e5
D.year = 365 * 864e5

if (!D.now)
	D.now = function () { return +new D() }

var map =
{
	s: 'second',
	m: 'minute',
	h: 'hour',
	d: 'day'
}

D.parseDiff = function (str)
{
	var m = /^([+-])?(\d+(?:\.\d+)?)([smhdy])$/.exec(str)
	if (!m)
		return null
	
	return [m[1] || '+', +m[2], map[m[3]]]
}

})();
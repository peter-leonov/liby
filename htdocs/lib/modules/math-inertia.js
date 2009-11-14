;(function(){

var M = Math, pow = M.pow, abs = M.abs
M.inertia = function (v, power)
{
	return pow(abs(v * 10), 1.2) * (v < 0 ? -1 : 1)
}

})();

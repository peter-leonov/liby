;(function(){

Math.longRandom = function ()
{
	return +new Date() + '' + Math.round(Math.random() * 1E+17)
}

})();

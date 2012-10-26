;(function(){

var round = Math.round,
	random = Math.random

function longRandom ()
{
	return +new Date() + '' + round(random() * 1E+17)
}

Object.add(Math, {longRandom: longRandom})

})();

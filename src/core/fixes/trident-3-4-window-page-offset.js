;(function(){

var win = window, de = document.documentElement

function updade ()
{
	win.pageXOffset = de.scrollLeft
	win.pageYOffset = de.scrollTop
}

// do not use attachEvent dew to its anomalies with execution order
win.addEventListener('scroll', updade, false)
updade()

})();
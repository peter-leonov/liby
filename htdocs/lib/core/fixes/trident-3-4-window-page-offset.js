;(function(){

var win = window, de = document.documentElement

function updade ()
{
	win.pageXOffset = de.scrollLeft
	win.pageYOffset = de.scrollTop
}

win.addEventListener('scroll', updade, false)
updade()

})();
;(function(){

function script (src) { document.write('<script src="' + src + '" type="text/javascript"></script>') }
function style (src) { document.write('<link rel="stylesheet" href="' + src + '" type="text/css"/>') }

script('/lib/modules/cascade.js')
script('/lib/modules/test.js')
script('/lib/widgets/tests.js')

style('/lib/tests/tests.css')

})();

;(function(){

function loadTracker (e)
{
	var _gaq = window._gaq = [];
	_gaq.push(['_setAccount', 'UA-XXXXX-X']);
	_gaq.push(['_trackPageview']);
	
	var ga = document.createElement('script')
	ga.type = 'text/javascript'
	ga.async = true
	ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
	(document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0]).appendChild(ga)
}

setTimeout(loadTracker, 2000)

})();

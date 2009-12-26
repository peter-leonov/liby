;(function(){

function script (src) { document.write('<script src="' + src + '" type="text/javascript"></script>') }
function style (src) { document.write('<link rel="stylesheet" href="' + src + '" type="text/css"/>') }

script('../modules/cascade.js')
script('../modules/test.js')
script('../widgets/tests.js')

style('tests.css')

})();
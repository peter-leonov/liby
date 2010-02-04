;(function(){

function script (src) { document.write('<script src="' + src + '" type="text/javascript"></script>') }
function style (src) { document.write('<link rel="stylesheet" href="' + src + '" type="text/css"/>') }

script('/lib/modules/cascade.js')
script('/lib/modules/test.js')
script('/lib/widgets/tests.js')
script('/js/ga.js')

style('/lib/tests/tests.css')

})();
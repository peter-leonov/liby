;(function(){

function script (src) { document.write('<script src="' + src + '" type="text/javascript"></script>') }
function style (src) { document.write('<link rel="stylesheet" href="' + src + '" type="text/css"/>') }

script('/lib/modules/cascade.js')
script('/lib/modules/test.js')
script('/lib/widgets/tests.js')

style('/lib/tests/tests.css')

})();

<!--# block name="ga" -->/* no ga.js was found */<!--# endblock -->
<!--# include virtual="/js/ga.js" stub="ga" -->
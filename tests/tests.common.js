;(function(){

function script (src) { document.write('<script src="' + src + '" type="text/javascript"></script>') }
function style (src) { document.write('<link rel="stylesheet" href="' + src + '" type="text/css"/>') }

script('../src/modules/cascade.js')
script('../src/modules/test.js')
script('../src/modules/test-tool.js')
script('../src/widgets/tests.js')

style('tests.css')

})();
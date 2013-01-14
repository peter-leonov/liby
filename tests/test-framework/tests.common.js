;(function(){

function script (src) { document.write('<script src="' + src + '"></script>') }
function style (src) { document.write('<link rel="stylesheet" href="' + src + '"/>') }

script('../test-framework/test.js')
script('../test-framework/test-q.js')
script('../test-framework/test-tool.js')
script('../test-framework/tests.js')

style('../test-framework/tests.css')

})();
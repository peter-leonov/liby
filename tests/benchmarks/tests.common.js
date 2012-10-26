;(function(){

function script (src) { document.write('<script src="' + src + '"></script>') }
function style (src) { document.write('<link rel="stylesheet" href="' + src + '"/>') }

script('../../modules/q.js')
script('../cascade/test.js')
script('../cascade/test-tool.js')
script('../cascade/tests.js')

style('../tests.css')

})();
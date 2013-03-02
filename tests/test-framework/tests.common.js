;(function(){

function script (src) { document.write('<script src="' + src + '"></script>') }
function style (src) { document.write('<link rel="stylesheet" href="' + src + '"/>') }

script('../test-framework/test.js')
script('../test-framework/test-q.js')
script('../test-framework/test-tool.js')
script('../test-framework/tests.js')

style('../test-framework/tests.css')

window._TestsHook = function ()
{
	var prefix
	if (/inshaker/.test(window.location.host))
		prefix = '/www/com.inshaker/htdocs/g/liby/'
	
	if (!prefix)
		return
	
	Tests.txmtLink = function ()
	{
		var m = /\/(tests\/.+\.html)$/.exec(window.location)
		if (!m)
			return
		return 'txmt://open?url=file://' + prefix + m[1]
	}
}

})();
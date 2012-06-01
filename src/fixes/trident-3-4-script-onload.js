(function(){

function fix (node)
{
	function onreadystatechange (e)
	{
		if (node.readyState == 'loaded')
		{
			var ne = document.createEvent('Event')
			ne.initEvent('load', false, true)
			node.dispatchEvent(ne)
		}
	}
	
	node.attachEvent('onreadystatechange', onreadystatechange)
	node.__liby_getListeners('load')
}

HTMLScriptElement.__liby_fixHooks.push(fix)

})();

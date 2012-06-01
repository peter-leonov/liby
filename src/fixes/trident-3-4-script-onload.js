(function(){

HTMLScriptElement.__liby_fixHook = function (node)
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
	node.__pmc_getListeners('load')
}

})();
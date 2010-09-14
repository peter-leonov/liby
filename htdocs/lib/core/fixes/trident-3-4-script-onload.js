(function(){

HTMLScriptElement.__pmc_fixHook = function (node)
{
	function onreadystatechange (e)
	{
		if (node.readyState == 'loaded')
		{
			var ne = document.createEvent('Event')
			ne.initEvent('load', false, true)
			if (!node.dispatchEvent(ne))
				e.preventDefault()
		}
	}
	
	node.attachEvent('onreadystatechange', onreadystatechange)
	node.__pmc_getListeners('load')
}

})();
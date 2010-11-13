(function(){

HTMLInputElement.__pmc_fixHook = function (node)
{
	node.__pmc__bindCatcher('focus')
	node.__pmc__bindCatcher('blur')
}

})();
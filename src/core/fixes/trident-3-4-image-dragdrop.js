(function(){

HTMLImageElement.__pmc_fixHook = function (node)
{
	node.__pmc__bindCatcher('dragstart')
	node.__pmc__bindCatcher('drag')
	node.__pmc__bindCatcher('dragenter')
	node.__pmc__bindCatcher('dragleave')
	node.__pmc__bindCatcher('dragover')
	node.__pmc__bindCatcher('drop')
	node.__pmc__bindCatcher('dragend')
}

})();
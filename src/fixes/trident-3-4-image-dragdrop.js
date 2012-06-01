(function(){

function fix (node)
{
	node.__liby__bindCatcher('dragstart')
	node.__liby__bindCatcher('drag')
	node.__liby__bindCatcher('dragenter')
	node.__liby__bindCatcher('dragleave')
	node.__liby__bindCatcher('dragover')
	node.__liby__bindCatcher('drop')
	node.__liby__bindCatcher('dragend')
}

HTMLImageElement.__liby_fixHooks.push(fix)

})();

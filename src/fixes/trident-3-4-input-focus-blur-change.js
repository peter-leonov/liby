(function(){

HTMLInputElement.__liby_fixHook = function (node)
{
	node.__liby__bindCatcher('focus')
	node.__liby__bindCatcher('blur')
	node.__liby__bindCatcher('change')
}

})();
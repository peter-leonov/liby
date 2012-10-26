(function(){

function fix (node)
{
	node.__liby__bindCatcher('focus')
	node.__liby__bindCatcher('blur')
	node.__liby__bindCatcher('change')
}

HTMLInputElement.__liby_fixHooks.push(fix)

})();

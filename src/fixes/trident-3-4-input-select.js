(function(){

function fix (node)
{
	node.__liby__bindCatcher('select')
}

HTMLInputElement.__liby_fixHooks.push(fix)

})();

(function(){

function fix (node)
{
	node.__liby__bindCatcher('submit')
}

HTMLFormElement.__liby_fixHooks.push(fix)

})();

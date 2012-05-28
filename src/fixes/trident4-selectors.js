(function(){

function getElementsByClassName (className)
{
	return this.querySelectorAll('.' + className)
}

document.getElementsByClassName = Element.prototype.getElementsByClassName = getElementsByClassName

})();

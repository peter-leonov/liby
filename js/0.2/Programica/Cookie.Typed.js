;(function(){

Cookie.stringify = function (value)
{
	var type = (typeof value).charAt(0)
	return type == 'u' ? type : type + value
}

Cookie.parse = function (value)
{
	var result = value.substr(1)
	switch (value.charAt(0))
	{
		case 'n': return +result
		case 'u': return undefined
	}
	return result
}


// var val = 123
// alert(Cookie.set('aaa', val) === val && Cookie.get('aaa') === val)
// var val = "123"
// alert(Cookie.set('aaa', val) === val && Cookie.get('aaa') === val)

})();
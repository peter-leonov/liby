
// require Programica

Error.prototype.toString = function ()
{
	var arr = new Array()
	for (var i in this) arr.push(i + ':' + this[i])
	return this.message + ': {' + arr.join(', ') + '}'
}

//Object.prototype.toString = function ()
//{
//	var arr = new Array()
//	for (var i in this) arr.push(i + ':' + this[i])
//	return '{' + arr.join(', ') + '}'
//}
//
//Array.prototype.toString = function ()
//{
//	return '[' + this.join(', ') + ']'
//}
//
//String.prototype.toString = function ()
//{
//	var str = this.replace(/\\/,'\\\\')
//	str = str.replace(/"/,'\\"')
//	return '"' + str + '"'
//}


function extend (to, from)
{
	for (var p in from)
		if (to[p] == undefined)
			to[p] = from[p]
}

Function.prototype.toString = function () {return "function()"}
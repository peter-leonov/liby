
;(function(){

// fast and easy but looks terrible
function parseOutJS (src)
{
	// this trick is for IE only
	src = src.split('')
	var i = 0, len = src.length, c,
		res = [], buff = '', open
	
	// string
	while (i < len)
	{
		c = src[i++]
		// backslash
		if (c === '\\') { buff += src[i++]; continue }
		
		// maybe code
		if (c === '$')
		{
			c = src[i++]
			// block
			if (c === '{')
			{
				res.push(buff)
				buff = ''
				open = 1
				while (i < len)
				{
					c = src[i++]
					// string ""
					if (c === '"')
					{
						buff += c
						while (i < len)
						{
							c = src[i++]
							// backslash
							if (c === '\\') { buff += src[i++]; continue }
							// end of string ""
							if (c === '"') { break }
							buff += c
						}
					}
					// string ''
					if (c === "'")
					{
						buff += c
						while (i < len)
						{
							c = src[i++]
							// backslash
							if (c === '\\') { buff += src[i++]; continue }
							// end of string ""
							if (c === "'") { break }
							buff += c
						}
					}
					// block
					if (c === '{') { open++ }
					// end of block
					else if (c === '}' && !--open) { res.push(buff); buff = ''; break}
					 
					// if (c === '\\') { i++; continue }
					buff += c
				}
			}
			// just one dollar ;)
			else
				buff += '$' + c
		}
		else
			buff += c
	}
	
	res.push(buff)
	
	return res
}

// bake() is used to increase compression level by placing nomungeble variables in one closure
function bake ($_$h, $_$s, $_$o)
{
	"$_$h:nomunge, $_$s:nomunge, $_$o:nomunge"
	return eval('(0, function($_$h){with($_$h){return ' + $_$o.join('+') + '}})')
}

var cache = {}
function interpolateJS (h)
{
	var i, b, s, o, f = cache[this]
	if (!f)
	{
		b = parseOutJS(this), s = [], o = []
		
		if (b[0])
			s[0] = b[0], o[0] = '($_$s[0])'
			
		
		for (i = 1; i < b.length; i+=2)
		{
			s.push(b[i+1])
		
			o.push('(' + b[i] + ')')
			o.push('$_$s[' + (i + 1)/2 + ']')
		}
		
		if (!b[b.length-1])
			o.length--
		f = cache[this] = bake(h, s, o)
	}
	try { return f.apply(this, arguments) }
	catch (ex) { reportError(ex); return null }
}

interpolateJS.cache = cache
String.prototype.interpolateJS = interpolateJS
String.parseOutJS = parseOutJS

// alert('1${a}2${b}3${c}4'.interpolateJS({a:'A',b:'B',c:'C'}))
// '${a{"a{\\\'a}\\"}a"b}c} wor$ld ${n{{{"\'"}}}n\'n\'}'.interpolateJS()

// // test for parseOutJS
// var blocks = parseOutJS('"hello" \\${x} ${a{"a{\\\'a}\\"}a"b}c} wor$ld ${n{{{"\'"}}}n\'n\'}')
// log(blocks[0] === '"hello" ${x} ')
// log(blocks[1] === 'a{"a{\'a}"}a"b}c')
// log(blocks[2] === ' wor$ld ')
// log(blocks[3] === 'n{{{"\'"}}}n\'n\'')
// log(blocks[4] === '')
// log(blocks[5] === undefined)

})();

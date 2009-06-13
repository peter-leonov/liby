
;(function(){

// fast and easy but looks terrible
function parseOutJS (src)
{
	// this trick is for IE only
	/*@cc_on src = src.split('') @*/
	var i = 0, len = src.length,
		res = [], buf = ''
	
	// string
	while (i < len)
	{
		var c = src[i++]
		// backslash
		if (c === '\\')
		{
			buf += src[i++]
			continue
		}
		
		// maybe code
		if (c === '$')
		{
			c = src[i++]
			// block
			if (c === '{')
			{
				res.push(buf)
				buf = ''
				var open = 1
				while (i < len)
				{
					c = src[i++]
					// string ""
					if (c === '"')
					{
						buf += c
						while (i < len)
						{
							c = src[i++]
							// backslash
							if (c === '\\') { buf += src[i++]; continue }
							// end of string ""
							if (c === '"') { break }
							buf += c
						}
					}
					// string ''
					if (c === "'")
					{
						buf += c
						while (i < len)
						{
							c = src[i++]
							// backslash
							if (c === '\\') { buf += src[i++]; continue }
							// end of string ""
							if (c === "'") { break }
							buf += c
						}
					}
					// block
					if (c === '{') { open++ }
					// end of block
					else if (c === '}' && !--open) { res.push(buf); buf = ''; break}
					 
					// if (c === '\\') { i++; continue }
					buf += c
				}
			}
			// just one dollar ;)
			else
				buf += '$' + c
		}
		else
			buf += c
	}
	
	res.push(buf)
	
	return res
}

// bake() is used to increase compression level by placing nomungeble variables in one closure
function bake ($_$h, $_$s, $_$o)
{
	"$_$h:nomunge, $_$s:nomunge, $_$o:nomunge"
	return eval('(0, function($_$h){with($_$h){return ' + $_$o.join('+') + '}})')
}

var cache = {}
function interpolate (h)
{
	var i, b, s, o, f = cache[this]
	if (!f)
	{
		b = parseOutJS(this), s = [], o = []
		
		s[0] = b[0]
		o[0] = '($_$s[0])'
		
		for (i = 1; i < b.length; i+=2)
		{
			s.push(b[i+1])
		
			o.push('(' + b[i] + ')')
			o.push('$_$s[' + (i + 1)/2 + ']')
		}
		
		if (!b[b.length-1])
			o.length--
		try { f = cache[this] = bake(h, s, o) }
		catch (ex)
		{
			log('Error while compiling string: "' + this + '"')
			throw ex
		}
	}
	try { return f.apply(this, arguments) }
	catch (ex)
	{
		log('Error while executing string: "' + this + '"')
		return null
	}
}

interpolate.cache = cache
String.prototype.interpolate = interpolate
String.parseOutJS = parseOutJS

// log('1${a}2${b}3${c}4'.interpolate({a:'A',b:'B',c:'C'}) === '1A2B3C4')
// log('${a/*{"a{\\\'a}\\"}a"b}c*/} wor$ld ${n/*{{{"\'"}}}n\'n\'*/}'.interpolate({a:111,n:222}) === '111 wor$ld 222')
// log('${a} text ${a} ${a} text ${b} ${b}'.interpolate({a:2222, b: 333}) === '2222 text 2222 2222 text 333 333')
// log('${a} text ${a} ${a} text ${b} ${b} text'.interpolate({a:2222, b: 333}) === '2222 text 2222 2222 text 333 333 text')

// // test for parseOutJS
// var blocks = parseOutJS('"hello" \\${x} ${a{"a{\\\'a}\\"}a"b}c} wor$ld ${n{{{"\'"}}}n\'n\'}')
// log(blocks[0] === '"hello" ${x} ')
// log(blocks[1] === 'a{"a{\'a}"}a"b}c')
// log(blocks[2] === ' wor$ld ')
// log(blocks[3] === 'n{{{"\'"}}}n\'n\'')
// log(blocks[4] === '')
// log(blocks[5] === undefined)

})();

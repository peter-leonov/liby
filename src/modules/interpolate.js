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
function bake ($_$h, $_$s, $_$code)
{
	"$_$h:nomunge, $_$s:nomunge, $_$code:nomunge"
	return eval('(0, function($_$h){with($_$h||{}){return ' + $_$code + '}})')
}

function compile (str, hash)
{
	var b = parseOutJS(str), bl = b.length
	
	// string has no js
	if (bl === 1)
		return b.join('')
	// string needs evaluation
	else
	{
		var s = [], o = []
		
		s[0] = b[0]
		o[0] = '($_$s[0])'
		
		for (var i = 1; i < bl; i+=2)
		{
			s.push(b[i+1])
			
			o.push('(' + b[i] + ')')
			o.push('$_$s[' + (i + 1)/2 + ']')
		}
		
		// if (!b[b.length-1])
		// 	o.length--
		try { return bake(hash, s, o.join('+')) }
		catch (ex)
		{
			log('Error while compiling string: "' + str + '"')
			throw ex
		}
	}
}

var cache = {}
function interpolate ()
{
	var f = cache[this]
	if (!f)
		f = cache[this] = compile(this)
	
	if (typeof f === 'string')
		return f
	else
	{
		try { return f.apply(this, arguments) }
		catch (ex)
		{
			ex.message += ', while executing string: "' + this + '"'
			throw ex
		}
	}
}

interpolate.cache = cache
String.prototype.interpolate = interpolate
String.parseOutJS = parseOutJS

})();
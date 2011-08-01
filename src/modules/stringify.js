// based on json2 (http://www.JSON.org/json2.js)
// WARNING: this is not a JSON library, this module is not secure, this module is for internal use only
// if you do not understand the difference please use the original json2.js library

;(function ()
{
	// Format integers to have at least two digits.
	function f (n) { return n < 10 ? '0' + n : n }
	
	var escapeable = new RegExp('[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]', 'g'),
	bareword = new RegExp('^[\$_a-zA-Z][\$_a-zA-Z0-9]*$'),
	Object_hasOwnProperty = Object.hasOwnProperty,
	Date_constructor = Date,
	String_constructor = String,
	meta =
	{
		'\b': '\\b',
		'\t': '\\t',
		'\n': '\\n',
		'\f': '\\f',
		'\r': '\\r',
		'"' : '\\"',
		'\\': '\\\\'
	}
	
	function quoteReplacer (a)
	{
		return meta[a] || '\\u' + ('0000' + (+(a.charCodeAt(0))).toString(16)).slice(-4)
	}
	
	function quote (string)
	{
		escapeable.lastIndex = 0
		return '"' + string.replace(escapeable, quoteReplacer) + '"'
	}
	
	
	function str (value)
	{
		var i, k, v, length
		
		switch (typeof value)
		{
			case 'string':
				return quote(value)
			
			case 'number':
			case 'boolean':
			case 'null':
				return String_constructor(value)
			
			// Objects
			case 'object':
				// Null
				if (!value)
					return 'null'
				
				var partial = [], partial_length = 0
				
				// Array
				if (typeof value.length === 'number' && !(value.propertyIsEnumerable('length')))
				{
					length = value.length
					if (length === 0)
						return '[]'
					
					for (i = 0; i < length; i += 1)
						partial[i] = str(value[i])
					
					return '[' + partial.join(',') + ']'
				}
				
				// Date
				if (value.constructor === Date_constructor)
					return value.getUTCFullYear() + '-' +
							f(value.getUTCMonth() + 1) + '-' +
							f(value.getUTCDate()) + 'T' +
							f(value.getUTCHours()) + ':' +
							f(value.getUTCMinutes()) + ':' +
							f(value.getUTCSeconds()) + 'Z';
				
				// Plain object
				for (k in value)
					if (Object_hasOwnProperty.call(value, k))
						partial[partial_length++] = (bareword.test(k) ? k : quote(k)) + ':' + str(value[k])
				
				return partial_length === 0 ? '{}' : '{' + partial.join(',') + '}'
		}
	}
	
	function parse (code)
	{
		parse.lastError = null
		try { return eval('(' + code + ')') }
		catch(ex) { log(ex); parse.lastError = ex; return null }
	}
	
	Object.stringify = str
	Object.parse = parse
	
}) ();

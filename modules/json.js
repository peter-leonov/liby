// based on json2 (http://www.JSON.org/json2.js)
if (!self.JSON)
(function(){

// Format integers to have at least two digits.
function f (n) { return n < 10 ? '0' + n : n }

var myName = 'JSON', Me = self[myName] = {},
escapeable = /[\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff\\]/g,
Object_hasOwnProperty = Object.hasOwnProperty,
Array_constructor = Array,
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
	var i, k, v, length, partial, partial_length
	
	switch (typeof value)
	{
		case 'string':
			return quote(value)
		
		case 'number':
		case 'boolean':
		case 'null':
			return String_constructor(value)
		
		case 'undefined':
			return 'null'
		
		// Objects
		case 'object':
			// Null
			if (!value)
				return 'null'
			
			// Array
			partial = []
			if (value.constructor === Array_constructor)
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
			partial_length = 0
			for (k in value)
				if (Object_hasOwnProperty.call(value, k))
					partial[partial_length++] = quote(k) + ':' + str(value[k])
			
			return partial_length === 0 ? '{}' : '{' + partial.join(',') + '}'
	}
}

function parse (text)
{
	parse.lastError = null
	var harmful = text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, '@')
					  .replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']')
					  .replace(/(?:^|:|,)(?:\s*\[)+/g, '')
					  .replace(/[\],:{}\s]+/g, '')
	
	if (harmful == '')
	{
		return eval('(' + text + ')')
	}
	
	throw new SyntaxError('harmful JSON: "' + harmful + '"')
}

Me.stringify = str
Me.parse = parse
	
})();

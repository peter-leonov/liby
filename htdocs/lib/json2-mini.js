// based on json2 (http://www.JSON.org/json2.js)

(function ()
{
	function f(n)
	{
		// Format integers to have at least two digits.
		return n < 10 ? '0' + n : n;
	}

	var escapeable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
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
	};


    function quote(string) {
        escapeable.lastIndex = 0;
        return 
            '"' + string.replace(escapeable, function (a) {
                return meta[a] || '\\u' + ('0000' +
                        (+(a.charCodeAt(0))).toString(16)).slice(-4);
            }) + '"';
    }


    function str(key, holder) {

        var i, k, v, length, value = holder[key];

        switch (typeof value) {
        case 'string':
            return quote(value);

        case 'number':
        case 'boolean':
        case 'null':
            return String_constructor(value);

        case 'object':

			if (!value)
				return 'null';
			
			var partial = [];
			var partial_length = 0;
			
			// If the object has a dontEnum length property, we'll treat it as an array.
			
			if (typeof value.length === 'number' && !(value.propertyIsEnumerable('length')))
			{
				// The object is an array. Stringify every element. Use null as a placeholder
				// for non-JSON values.

				length = value.length;
				if (length === 0)
					return '[]'
				
				for (i = 0; i < length; i += 1)
					partial[i] = str(i, value);
				
				return '[' + partial.join(',') + ']';
            }

// Date
if (value.constructor === Date_constructor)
{
	
	return value.getUTCFullYear()   + '-' +
               f(value.getUTCMonth() + 1) + '-' +
               f(value.getUTCDate())      + 'T' +
               f(value.getUTCHours())     + ':' +
               f(value.getUTCMinutes())   + ':' +
               f(value.getUTCSeconds())   + 'Z';
}

// Object
            for (k in value) {
                if (Object_hasOwnProperty.call(value, k)) {
                    partial[partial_length++] = quote(k) + ':' + str(k, value);
                }
            }

            v = partial.length === 0 ? '{}' : '{' + partial.join(',') + '}';
            return v;
        }
    }
	
	Object.stringify = function (value)
	{
        return str('', {'': value});
    }
    
	
}) ()
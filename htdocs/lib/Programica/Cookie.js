;(function(){

var myName = 'Cookie', day = 864e5, encode = encodeURIComponent, decode = decodeURIComponent, doc = document

if (!self[myName]) self[myName] =
{
	days: 30,
	set: function (name, value, days)
	{
		var d = new Date()
		days = typeof days === 'number' ? days : this.days
		
		d.setTime(d.getTime() + day * days)
		doc.cookie = encode(name) + '=' + this.stringify(value) + '; expires=' + d.toGMTString()
		return value
	},
	
	get: function (name)
	{
		var value, cookie = new RegExp('(^|;)\\s*' + encode(name) + '=([^;\\s]*)').exec(doc.cookie)
		return cookie ? this.parse(cookie[2]) : null
	},
	
	erase: function (name)
	{
		var cookie = this.get(name) || true
		this.set(name, '', -1)
		return cookie
	},
	
	stringify: function (value) { return value },
	parse: function (value) { return value }
}

})();
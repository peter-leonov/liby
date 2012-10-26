;(function(){

var Me = Function

var myProto =
{
	inherit: function (s, prefix)
	{
		if (!prefix)
			prefix = 'super'
		
		var proto = this.prototype
		
		for (var k in s)
		{
			var v = s[k]
			
			if (typeof v != 'function')
			{
				proto[k] = v
				continue
			}
			
			// save super property “abc” as “superAbc”
			proto[prefix + k.capitalize()] = proto[k]
			
			proto[k] = v
		}
	},
	
	inheritLive: function (s, prefix)
	{
		if (!prefix)
			prefix = 'super'
			
		// save original prototype
		var original = this.prototype
		
		// make a live-clone of the original
		function Proxy () {}
		Proxy.prototype = original
		var proto = new Proxy()
		
		// set the live-clone as our prototype
		this.prototype = proto
		
		for (var k in s)
		{
			var v = s[k]
			
			if (typeof v != 'function')
			{
				proto[k] = v
				continue
			}
			
			// save super property “abc” as “superAbc”
			proto[prefix + k.capitalize()] = (function (k) { return function () { return original[k].apply(this, arguments) } })(k)
			
			proto[k] = v
		}
	}
}

Object.extend(Me.prototype, myProto)

})();

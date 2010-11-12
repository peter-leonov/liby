// base objects extensions
// this code is heavily minified and it couldn not be changed frequently
;(function(){

var O = Object, A = Array, Ap = A.prototype, S = String, Sp = S.prototype, Fp = Function.prototype, D = Date, M = Math

function add (d, s) { if (d) for (var k in s) if (!(k in d)) d[k] = s[k]; return d }
function extend (d, s) { if (d) for (var k in s) d[k] = s[k]; return d }

add
(
	O,
	{
		add: add,
		extend: extend,
		copy: function (s) { var d = {}; for (var k in s) d[k] = s[k]; return d },
		keys: function (s) { var r = []; for (var k in s) r.push(k); return r },
		keysCount: function (s) { var l = 0; for (var k in s) l++; return l },
		values: function (s) { var r = []; for (var k in s) r.push(s[k]); return r },
		isEmpty: function (s) { for (var k in s) return false; return true }
	}
)

add
(
	S,
	{
		localeCompare: function (a, b) { return a < b ? -1 : (a > b ? 1 : 0) }
	}
)

add
(
	Sp,
	{
		trim: function () { return this.replace(/^\s+|\s+$/g, '') },
		capitalize: function () { return this.charAt(0).toUpperCase() + this.substr(1) }
	}
)

add
(
	Fp,
	{
		mixIn: function (module) { return extend(this.prototype, module.prototype) },
		extend: function (s) { for (var k in s) this[k] = s[k]; return this },
		bind: function (inv, args) { var me = this; return function () { me.apply(inv, args || arguments) } }
	}
)

var ceil = M.ceil, floor = M.floor, round = M.round, random = M.random
add(M, {longRandom: function () { return (new D()).getTime().toString() + round(random() * 1E+17) }})


add
(
	Ap,
	{
		indexOf: function (v, i)
		{
			var len = this.length
			
			if ((i = +i))
			{
				if (i < 0)
					i = ceil(i) + len
				else
					i = floor(i)
			}
			else
				i = 0
			
			for (; i < len; i++)
				if (i in this && this[i] === v)
					return i
			return -1
		},
		uniq: function ()
		{
			var res = [], j = 0
			for (var i = 0, il = this.length; i < il; i++)
			{
				var v = this[i]
				if (res.indexOf(v) === -1)
					res[j++] = v
			}
			return res
		},
		forEach: function (f, inv) { for (var i = 0, len = this.length; i < len; i++) f.call(inv, this[i], i, this) },
		map: function(f, inv)
		{
			var len = this.length,
				res = new A(len)
			for (var i = 0; i < len; i++)
				if (i in this)
					res[i] = f.call(inv, this[i], i, this)
			return res
		}
	}
)

add(A, {copy: function (src) { return Ap.slice.call(src) }})

})();
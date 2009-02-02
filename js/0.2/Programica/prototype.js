// base objects extensions
// this code is heavy minified and it couldn't be changed frequently
;(function(){

var A = Array, Ap = A.prototype, S = String, F = Function, D = Date, N = Number, M = Math

function add (d, s) { if (d) for (var k in s) if (!(k in d)) d[k] = s[k]; return d }

add
(
	Object,
	{
		add: add,
		extend: function (d, s) { if (d) for (var k in s) d[k] = s[k]; return d },
		copy: function (s) { var d = {}; for (var k in s) d[k] = s[k]; return d },
		keys: function (s) { var r = []; for (var k in s) r.push(k); return r },
		values: function (s) { var r = []; for (var k in s) r.push(s[k]); return r }
	}
)

add(String, {localeCompare: function (a, b) { return a < b ? -1 : (a > b ? 1 : 0) }})


var ceil = M.ceil, floor = M.floor, round = M.round, random = M.random
add(M, {longRandom: function () { return (new D()).getTime().toString() + round(random() * 1E+17) }})


add
(
	Ap,
	{
		indexOf: function(v, i)
		{
			var len = this.length,
				i = N(i) || 0
			i = (i < 0) ? (ceil(i) + len) : floor(i)

			for (; i < len; i++)
				if (i in this && this[i] === v)
					return i
			return -1
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
;(function () {

var Me =
{
	intersectSegments: function (s1, e1, s2, e2)
	{
		// great thank you to Ivan Yanikov, dobrokot 'at' gmail.com
		
		var a1 = s1[1] - e1[1]
		var b1 = e1[0] - s1[0]
		var d1 = s1[0] * e1[1] - e1[0] * s1[1]
		
		var a2 = s2[1] - e2[1]
		var b2 = e2[0] - s2[0]
		var d2 = s2[0] * e2[1] - e2[0] * s2[1]
		
		var l1s = a2 * s1[0] + b2 * s1[1] + d2
		var l1e = a2 * e1[0] + b2 * e1[1] + d2
		
		var l2s = a1 * s2[0] + b1 * s2[1] + d1
		var l2e = a1 * e2[0] + b1 * e2[1] + d1
		
		if (l1s * l1e >= 0 || l2s * l2e >= 0)
			return false
		
		var u = l1s / (l1s - l1e)
		
		return [s1[0] + u * (e1[0] - s1[0]), s1[1] + u * (e1[1] - s1[1])]
	},
	
	isPointInShape: function (shape, point)
	{
		// great thank you to Ivan Yanikov, dobrokot 'at' gmail.com
		
		var px = point[0], py = point[1]
		
		var intersections = 0
		
		var prevNum = shape.length - 1,
			prevUnder = shape[prevNum][1] < py
		
		for (var i = 0, il = shape.length; i < il; i++)
		{
			var cur = shape[i],
				prev = shape[prevNum]
			
			var curUnder = cur[1] < py
			
			var ax = prev[0] - px
			var ay = prev[1] - py
			
			var bx = cur[0] - px
			var by = cur[1] - py
			
			var t = ax * (by - ay) - ay * (bx - ax)
			
			if (curUnder && !prevUnder)
			{
				if (t >= 0)
					intersections++
			}
			else if (!curUnder && prevUnder)
			{
				if (t < 0)
					intersections++
			}
			
			prevNum = i
			prevUnder = curUnder
		}
		
		return intersections & 1
	},
	
	intersectShapeWithSegment: function (shape, s, e)
	{
		var points = []
		
		var prevNum = shape.length - 1
		for (var i = 0, il = shape.length; i < il; i++)
		{
			var cur = shape[i],
				prev = shape[prevNum]
			
			var point = this.intersectSegments(prev, cur, s, e)
			if (point)
				points.push(point)
			
			prevNum = i
		}
		
		return points
	},
	
	intersectShapes: function (a, b)
	{
		var points = []
		
		var prevA = a.length - 1
		for (var i = 0, il = a.length; i < il; i++)
		{
			var prevB = b.length - 1
			for (var j = 0, jl = b.length; j < jl; j++)
			{
				var point = this.intersectSegments(a[prevA], a[i], b[prevB], b[j])
				if (point)
					points.push(point)
				
				prevB = j
			}
			prevA = i
		}
		
		for (var i = 0, il = a.length; i < il; i++)
		{
			var point = a[i]
			if (this.isPointInShape(b, point))
				points.push(point)
		}
		
		for (var i = 0, il = b.length; i < il; i++)
		{
			var point = b[i]
			if (this.isPointInShape(a, point))
				points.push(point)
		}
		
		return points
	}
}

Me.className = 'Vector'
self[Me.className] = Me

})();


// 1, 2, 5: банкир, банкира, банкиров
String.prototype.plural = Number.prototype.plural = function (a, b, c)
{
	if (this % 1)
		return b
	
	var v = Math.abs(this) % 100
	if (11 <= v && v <= 19)
		return c
	
	v = v % 10
	if (2 <= v && v <= 4)
		return b
	if (v == 1)
		return a
	
	return c
}

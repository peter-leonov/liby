var helpHighlighters = {}

helpHighlighters.bind = function (highs)
{
	var t = this
	var down = function () { t.highlightDown() }
	var out  = function () { t.highlightOut() }
	
	for (var i = 0; i < highs.length; i++)
		highs[i].addEventListener('mousedown', down, false),
		highs[i].addEventListener('mouseout', out,  false)
}

helpHighlighters.highlightDown = function ()
{
	var nodes = cssQuery(this.getAttribute('pmc-highlight'))
	
	clearTimeout(this.time)
	if (this.delight)
		this.delight()
	this.delight = function ()
	{
		for (var i = 0; i < nodes.length; i++)
			nodes[i].removeClassName('highlight')
	}
	
	for (var i = 0; i < nodes.length; i++)
		nodes[i].addClassName('highlight')
}

helpHighlighters.highlightOut = function ()
{
	if (this.delight)
		this.time = setTimeout(this.delight, 750)
}
;(function(){

var doc = document

function NodesBuilder (el)
{
	this.el = el
}

var proto = NodesBuilder.prototype

proto.text = function (text)
{
	var el = doc.createTextNode(text)
	this.el.appendChild(el)
	return this
}

proto.add = function (tag, cn)
{
	var el = doc.createElement(tag)
	el.className = cn
	this.el.appendChild(el)
	return new NodesBuilder(el)
}

proto.attr = function (name, val)
{
	this.el[name] = val
	return this
}

Liby.NodesBuilder = NodesBuilder

})();


;(function(){

var p = Liby.NodesBuilder.prototype

p.empty = function ()
{
	var el = this.el
	var fc
	while ((fc = el.firstChild))
		el.removeChild(fc)
}

p.remove = function ()
{
	var parent = this.el.parentNode
	if (!parent)
		return
	
	parent.removeChild(this.el)
}

p.parent = function ()
{
	var parent = this.el.parentNode
	if (!parent)
		return null
	
	return new Liby.NodesBuilder(parent)
}

p.isParent = function (parent, root)
{
	var node = this.el
	do
	{
		if (node === parent)
			return true
		if (node === root)
			break
	}
	while ((node = node.parentNode))
	
	return false
}

p.parentWithClass = function (cn, root)
{
	if (!root)
		root = document.documentElement
	
	var node = this.el
	do
	{
		if (node.classList.contains(cn))
			return node
		if (node === root)
			break
	}
	while ((node = node.parentNode))
	
	return null
}

p.offsetPosition = function (root)
{
	var node = this.el,
		left = 0, top = 0
	
	if (root)
		root = root.el
	
	if (node == root)
		return {left: left, top: top}
	
	var parent, lastNode
	for (;;)
	{
		left += node.offsetLeft
		top += node.offsetTop
		
		parent = node.offsetParent
		if (parent && parent !== root)
		{
			lastNode = node
			node = parent
		}
		else
		{
			if (lastNode)
			{
				left -= lastNode.scrollLeft
				top -= lastNode.scrollTop
			}
			
			break
		}
	}
	
	return {left: left, top: top}
}

})();

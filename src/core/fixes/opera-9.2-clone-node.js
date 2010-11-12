if (self.opera && /^9.2/.test(self.opera.version()))
{
	var proto = Element.prototype
	proto.__nativeCloneNode = proto.cloneNode
	proto.cloneNode = function (deep)
	{
		var node = this.__nativeCloneNode(deep)
		if (deep)
			node.innerHTML = node.innerHTML
		return node
	}
}


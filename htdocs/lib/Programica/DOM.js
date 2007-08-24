
// DOM для всех

if (!window.Programica.DOM) Programica.DOM = {}

if (document.evaluate)
{
	// from prototype 1.5.1.1
	Programica.DOM.getElementsByXPath = function (expression, ns)
	{
		var results = []
		var query = document.evaluate
		(
			expression, this, (ns || null),
			XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null
		)
		
		for (var i = 0, length = query.snapshotLength; i < length; i++)
			results.push(query.snapshotItem(i));
		
		return results;
	}
}

// from prototype 1.5.1.1
Programica.DOM.getElementsByClassName_xpath = function (className, tagName)
{
	var q = ".//" + (tagName || '*') + "[@class = ' " + className + " ' or contains(concat(' ', @class, ' '), ' " + className + " ')]";
	return this.getElementsByXPath(q);
}

// from prototype 1.5.1.1
Programica.DOM.getElementsByClassName_js = function (className, tagName)
{
	// geting elems with native function
	var children = this.getElementsByTagName(tagName || '*')
	// predeclaring vars
	var elements = [], child, l = 0
	// precompile regexp
	var rex = new RegExp("\\b" + className + "\\b")
	// length is constant, so caching its value
	var len = children.length
	
	// memory for elements array allocated only once
	elements.length = len
	for (var i = 0; i < len; i++)
	{
		// even caching the reference for children[i]
		// gives us some milliseconds
		child = children[i]
		// just rely on RegExp engine
		if (rex.test(child.className))
		{
			// simple assignment
			elements[l] = child
			// simple increment
			l++
		}
	}
	// truncating garbage length
	elements.length = l
	
	return elements
}

// lets choose the right way to get elements
if (document.getElementsByClassName)
	true
else if (Programica.DOM.getElementsByXPath)
	Programica.DOM.getElementsByClassName = Programica.DOM.getElementsByClassName_xpath
else
	Programica.DOM.getElementsByClassName = Programica.DOM.getElementsByClassName_js




Programica.DOM.addClassName = function (cn)
{
	this.remClassName(cn)
	this.className += ' ' + cn
	return cn
}

Programica.DOM.remClassName = function (cn)
{
	this.className = this.className.replace(new RegExp('\\s*\\b' + cn + '\\b\\s*', "g"), " ").replace(/^\s+|\s+$/g, "")
	return cn
}

Programica.DOM.hasClassName = function (cn)
{
	return (this.className == cn || (new RegExp('\\b' + cn + '\\b')).test(this.className))
}

Programica.DOM.disable = function ()
{
	this.setAttribute('disabled', true)
	this.addClassName('disabled')
}

Programica.DOM.enable = function ()
{
	this.removeAttribute('disabled')
	this.remClassName('disabled')
}

Programica.DOM.hide = function (t)
{
	if (t)
	{
		if (this.animate)
		{
			var ani = this.animate('linearTween', {opacity:[0]}, t)
			ani.addEventListener
			(
				'complete',
				function ()
				{
					this.obj.style.display = 'none'
				}
			)
			ani.start()
			return ani
		}
		else
			setTimeout(function () { this.style.display = 'none' }, t * 1000)
	}
	else
		this.style.display = 'none'
	
	return true
}

Programica.DOM.show = function (t)
{
	if (t)
	{
		if (this.animate)
		{
			if (!this.visible()) this.style.opacity = 0
			this.style.display = 'block'
			this.style.visibility = 'visible'
			return this.animate('linearTween', {opacity:1}, t).start()
		}
		else
			setTimeout(function () { this.style.display = 'block'; this.style.opacity = 1 }, t * 1000)
	}
	else
	{
		this.style.visibility = 'visible'
		this.style.display = 'block'
	}
	
	return true
}

Programica.DOM.visible = function ()
{
	//log(this.style.opacity + ': ' + parseFloat(this.style.opacity))
	return this.offsetWidth && this.style.display != 'none' && parseFloat(this.style.opacity) != 0
}

Programica.DOM.$$ = function (cn)
{
	return this.getElementsByClassName(cn)
}

Programica.DOM.$$$ = function (cn)
{
	return this.getElementsByTagName(cn)
}

Programica.DOM.getComputedStyle = function (prop)
{
	return document.defaultView.getComputedStyle(this, null).getPropertyValue(prop)
}


{
	var interfaces = [Element]
	
	for (var ii = 0; ii < interfaces.length; ii++)
		for (var m in Programica.DOM)
			interfaces[ii].prototype[m] = Programica.DOM[m]
}

if (!document.getElementsByClassName)
	document.getElementsByClassName = Programica.DOM.getElementsByClassName

if (!document.getElementsByXPath)
	document.getElementsByXPath = Programica.DOM.getElementsByXPath


log2("Programica/DOM.js loaded")
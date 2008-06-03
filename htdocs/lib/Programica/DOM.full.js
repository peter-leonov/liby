
// DOM для всех

if (!self.Programica) self.Programica = {}
if (!self.Programica.DOM) self.Programica.DOM = {}

if (document.evaluate)
{
	// from prototype
	Programica.DOM.getElementsByXPath = function (expression)
	{
		var results = []
		var query = document.evaluate
		(
			expression, this, function () { return document.documentElement.namespaceURI },
			XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null
		)
		
		for (var i = 0, length = query.snapshotLength; i < length; i++)
			results.push(query.snapshotItem(i))
		
		return results
	}
}

// from prototype 1.5.1.1
Programica.DOM.getElementsByClassName_xpath = function (className, tagName)
{
	var q = ".//" + (tagName || '*') + "[@class = ' " + className + " ' or contains(concat(' ', @class, ' '), ' " + className + " ')]"
	return this.getElementsByXPath(q)
}

// from prototype 1.5.1.1
Programica.DOM.getElementsByClassName_js = function (className, tagName)
{
	// geting elems with native function
	var children = this.getElementsByTagName(tagName || '*')
	// predeclaring vars
	var elements = [], child, l = 0
	// precompile regexp
	var rex = new RegExp("(?:\\s+|^)" + className + "(?:\\s+|$)")
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


Programica.DOM.getElementsBySelector = function (css)
{
	return cssQuery(css, this)
}


Programica.DOM.setClassName = function (cn)
{
	this.className = cn
	return cn
}

Programica.DOM.addClassName = function (cn)
{
	this.remClassName(cn)
	this.className += ' ' + cn
	return cn
}

Programica.DOM.remClassName = function (cn)
{
	this.className = this.className && this.className.replace(new RegExp('(?:\\s+|^)' + cn + '(?:\\s+|$)', "g"), " ").replace(/^\s+|\s+$/g, "")
	return cn
}

Programica.DOM.getClassNameHash = function (cn)
{
	var hash = {}
	var all = String(this.className).split(/\s+/)
	for (var i = 0, il = all.length; i < il; i++)
	{
		var cn = all[i]
		if (cn)
			hash[cn] = cn
	}
	return hash
}

Programica.DOM.hasClassName = function (cn)
{
	return (this.className == cn || (new RegExp('(?:\\s+|^)' + cn + '(?:\\s+|$)')).test(this.className))
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

Programica.DOM.empty = function ()
{
	var node
	while (node = this.firstChild)
		this.removeChild(node)
}

Programica.DOM.show = function (t)
{
	if (this.onshow)
	{
		if (typeof this.onshow == 'string')
			this.onshow = eval('function (event) { ' + this.onshow + ' }')
		
		if (this.onshow({}) === false)
			return false
	}
	
	if (t)
	{
		if (this.animate)
		{
			if (!this.visible()) this.style.opacity = 0
			this.style.display = 'block'
			this.style.visibility = 'visible'
			return this.animate('linearTween', {opacity:1}, t)
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

Programica.DOM.hide = function (t)
{
	if (this.onhide)
	{
		if (typeof this.onhide == 'string')
			this.onhide = eval('function (event) { ' + this.onhide + ' }')
		
		if (this.onhide({}) === false)
			return false
	}
	
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
			return ani
		}
		else
			setTimeout(function () { this.style.display = 'none' }, t * 1000)
	}
	else
		this.style.display = 'none'
	
	return true
}

Programica.DOM.visible = function ()
{
	//log(this.style.opacity + ': ' + parseFloat(this.style.opacity))
	return this.offsetWidth && this.style.display != 'none' && parseFloat(this.style.opacity) != 0
}

Programica.DOM.toggle = function (t)
{
	return this.visible() ? this.hide(t) : this.show(t)
}

Programica.DOM.getComputedStyle = function (prop)
{
	return document.defaultView.getComputedStyle(this, null)
}

Programica.DOM.getElementListBySelector = function(q)
{
	var xhtml = true
	q = q.replace(/\s+/g, ' ')
	q = q.replace(/\s*([\!\=\[\]\>\+\~])\s*/g, '$1')
	log(q)
	if (xhtml)
	{
		q = q.replace(/(^[a-z])/g, 'x:$1')						// (div) -> x:div
		log(q)
		q = q.replace(/([ >])([a-z])/g, '$1x:$2')				// ( div) -> x:div
		log(q)
	}
	q = q.replace(/ /g, '/descendant::')
	log(q)
	return this.getElementsByXPath(q)
}

// расширяем базовый класс всех элементов (в т.ч. XUL, SVG и иже с ними)
for (var m in Programica.DOM)
	Element.prototype[m] = Programica.DOM[m]



if (!document.getElementsByClassName)
	document.getElementsByClassName = Programica.DOM.getElementsByClassName

if (!document.getElementsByXPath)
	document.getElementsByXPath = Programica.DOM.getElementsByXPath


log2("Programica/DOM.js loaded")
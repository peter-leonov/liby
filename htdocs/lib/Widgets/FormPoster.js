{(function () {
var P = Programica
var FormPoster = P.FormPoster = function () {}
var prototype = FormPoster.prototype = new P.Widget()

prototype.mainNodeTagName = 'form'
prototype.klass = 'Programica.FormPoster'
prototype.Handler = function (node)
{
	this.mainNode = node
	
	// where form.action is a node
	if (node.action && typeof node.action != 'string')
		throw new Error('Form element with name "action" masks form own attribute.')
	
	if (node.enctype && typeof node.enctype != 'string')
		throw new Error('Form element with name "enctype" masks form own attribute.')
	
	// for files upload
	if (/^multipart\/form\-data$/i.test(node.getAttribute('enctype')))
	{
		// check if this form needs to be proceeded
		if (!/^ajax$/i.test(node.target))
			return
		
		var frameName = 'id-' + Math.longRandom()
		
		var iframe = $E('iframe', {name: frameName, id: frameName})
		iframe.style.display = 'none'
		document.body.appendChild(iframe)
		iframe.src = 'about:blank'
		node.target = frameName
		
		FormPoster.bakeEvents(node)
		
		function firstOnLoad ()
		{
			this.removeEventListener('load', firstOnLoad, false)
			var me = this
			setTimeout(function () { me.addEventListener('load', function () { node.onsuccess({request:iframe}) }, false) }, 10)
		}
		
		iframe.addEventListener('load', firstOnLoad, false)
	}
	else
	{
		function sendListener (e)
		{
			// check if this form needs to be proceeded
			if (!/^ajax$/i.test(this.target))
				return
			
			e.preventDefault()
			
			// play in events
			var event = {request: this, hash: this.toHash(), target: this}
			FormPoster.bakeEvents(node)
			
			if (this.oncheck(event) === false)
				return
			
			this.addClassName('sending')
			
			// acync sending data
			var met	= /^post$/i.test(this.method) ? aPost : aGet
			var me = this
			with (met(this.action, event.hash))
			{
				onLoad		= function () { me.remClassName('sending'); me.onload(event) }
				onSuccess	= function () { me.onsuccess(event) } // me.reset();
				onError		= function () { me.onerror(event) }
			}
		}
		
		node.addEventListener('submit', sendListener,  false)
	}
}


prototype.Handler.prototype = { init: function () {} }


FormPoster.defaultEvents = ['onload', 'onsuccess', 'onerror', 'oncheck']
FormPoster.bakeEvents = function (node, events)
{
	events = events || this.defaultEvents
	for (var i = 0; i < events.length; i++)
		if (!node[events[i]] || node[events[i]].constructor == String)
			node[events[i]] = eval("[function (event) { " + node.getAttribute(events[i]) + " }]")[0]
}


P.Widget.register(new FormPoster())
})()}
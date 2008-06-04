
Programica.FormPoster = function () {}

Programica.FormPoster.prototype = new Programica.Widget()
Programica.FormPoster.prototype.mainNodeTagName = 'form'
Programica.FormPoster.prototype.klass = 'Programica.FormPoster'
Programica.FormPoster.prototype.Handler = function (node)
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
		// check this form need to be proceeded
		if (!/^ajax$/i.test(node.target))
			return
		
		var frame_name = 'id_' + Math.longRandom()
		
		var iframe = $E('iframe', {name: frame_name, id: frame_name})
		iframe.style.display = 'none'
		document.body.appendChild(iframe)
		iframe.src = 'about:blank'
		node.target = frame_name
		
		Programica.FormPoster.bakeEvents(node, ['onload', 'onsuccess', 'onerror'])
		
		function firstOnLoad ()
		{
			this.removeEventListener('load', firstOnLoad, false)
			var t = this
			setTimeout(function () { t.addEventListener('load', function () { node.onsuccess({request:iframe}) }, false) }, 10)
		}
		
		iframe.addEventListener('load', firstOnLoad, false)
	}
	else
	{
		function sendListener (e)
		{
			// check this form need to be proceeded
			if (!/^ajax$/i.test(this.target))
				return
			
			this.addClassName('sending')
			
			// play in events
			Programica.FormPoster.bakeEvents(node, ['onload', 'onsuccess', 'onerror'])
			
			e.preventDefault()
			var met	= /^post$/i.test(this.method) ? aPost : aGet
			
			// acync sending data
			var t = this
			with (met(this.action, this.toHash()))
			{
				onLoad		= function () { t.remClassName('sending'); t.onload({request:this}) }
				onSuccess	= function () { t.onsuccess({request:this}) } // t.reset();
				onError		= function () { t.onerror({request:this}) }
			}
		}
		
		node.addEventListener('submit', sendListener,  false)
	}
}


Programica.FormPoster.prototype.Handler.prototype =
{
	init: function () { /*пусто*/ }
}


//Programica.FormPoster.code2event = function (code) { return eval("[function (event) { " + code + " }]")[0] }
Programica.FormPoster.bakeEvents = function (node, events)
{
	for (var i = 0; i < events.length; i++)
		if (!node[events[i]] || node[events[i]].constructor == String)
			node[events[i]] = eval("[function (event) { " + node.getAttribute(events[i]) + " }]")[0]
}


Programica.Widget.register(new Programica.FormPoster())
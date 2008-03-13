
Programica.FormPoster = function () {}

Programica.FormPoster.prototype = new Programica.Widget()
Programica.FormPoster.prototype.mainNodeTagName = 'form'
Programica.FormPoster.prototype.klass = 'Programica.FormPoster'
Programica.FormPoster.prototype.Handler = function (node)
{
	this.mainNode = node
	
	// where 'form action="action"' in IE
	if (node.action && typeof node.action != 'string')
		throw new Error('Form element with name "action" masks form own attribute.')
	
	if (node.enctype && typeof node.enctype != 'string')
		throw new Error('Form element with name "enctype" masks form own attribute.')
	
	// for upload
	if (/^multipart\/form\-data$/i.test(node.getAttribute('enctype')))
	{
		// проверим, нужно ли ловить эту форму
		if (!/^ajax$/i.test(node.target))
			return
		
		var frame_name = 'id_' + Math.longRandom()
		
		var iframe = $E('iframe', {name: frame_name, id: frame_name, src: 'about:blank'})
		iframe.style.display = 'none'
		document.body.appendChild(iframe)
		node.target = frame_name
		
		Programica.FormPoster.bakeEvents(node, ['onload', 'onsuccess', 'onerror'])
		
		iframe.addEventListener
		(
			'load',
			function ()
			{
				this.addEventListener
				(
					'load',
					function ()
					{
						node.onsuccess({request:iframe})
					},
					false
				)
			},
			false
		)
	}
	else
	{
		function sendListener (e)
		{
			// проверим, нужно ли ловить эту форму
			if (!/^ajax$/i.test(this.target))
				return
			
			// поиграем в события
			Programica.FormPoster.bakeEvents(node, ['onload', 'onsuccess', 'onerror'])
			
			e.preventDefault()
			var met	= /^post$/i.test(this.method) ? aPost : aGet
			
			// собственно отправляем данные
			var t = this
			with (met(this.action, this.toHash()))
			{
				onLoad		= function () { t.onload({request:this}) }
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
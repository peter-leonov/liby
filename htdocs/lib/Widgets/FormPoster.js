
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
	
	var send_listener = function (e)
	{
		// проверим, нужно ли ловить эту форму
		if (!/^ajax$/i.test(this.target))
			return
		
		// не даем форме отправиться (кое-как работает в ИЕ нашими стараниями)
		
		// поиграем в события
		Programica.FormPoster.bakeEvents(node, ['onload', 'onsuccess', 'onerror'])
		
		var t	= this
		

		e.preventDefault()
		var met	= /^post$/i.test(this.method) ? aPost : aGet
		
		// собственно отправляем данные
		with (met(this.action, this.toHash()))
		{
			onLoad		= function () { t.onload({request:this}) }
			onSuccess	= function () { t.onsuccess({request:this}) } // t.reset();
			onError		= function () { t.onerror({request:this}) }
		}
	}
	
	// for Upload
	if (/^multipart\/form\-data$/i.test(node.getAttribute('enctype')))
	{
		var frame_name	= 'id_' + Math.longRandom()
		
		var iframe = $E('iframe', {name: frame_name, 'class': 'empty_iframe', src: 'about:blank'})
		node.target = frame_name
		document.body.appendChild(iframe)
		
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
		node.addEventListener('submit', send_listener,  false)
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
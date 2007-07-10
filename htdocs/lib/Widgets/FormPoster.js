
Programica.FormPoster = function () {}

Programica.FormPoster.prototype = new Programica.Widget()
Programica.FormPoster.prototype.mainNodeTagName = 'form'
Programica.FormPoster.prototype.klass = 'Programica.FormPoster'
Programica.FormPoster.prototype.Handler = function (node)
{
	this.mainNode = node
	
	var send_listener = function (e)
	{
		// проверим, нужно ли ловить эту форму
		if (!/^ajax$/i.test(this.getAttribute('target'))) return
		
		// не даем форме отправиться (кое-как работает в ИЕ нашими стараниями)
		e.preventDefault()
		
		// поиграем в события
		Programica.FormPoster.bakeEvents(node, ['onload', 'onsuccess', 'onerror'])
		
		var form = this
		
		// собственно отправляем данные
		with (aPost(this.getAttribute('action'), this.data()))
		{
			onLoad		= function () { form.onload({request:this}) }
			onSuccess	= function () { form.reset(); form.onsuccess({request:this}) }
			onError		= function () { form.onerror({request:this}) }
		}
	}
	
	//node.addEventListener('submit', check_listener, false)
	node.addEventListener('submit', send_listener,  false)
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
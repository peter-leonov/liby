
Programica.FormPoster = function () {}

Programica.FormPoster.prototype = new Programica.Widget()
Programica.FormPoster.prototype.mainNodeTagName = 'form'
Programica.FormPoster.prototype.klass = 'Programica.FormPoster'
Programica.FormPoster.prototype.Handler = function (node)
{
	this.mainNode = node
	var t = this
	
	var submit_listener = function (e)
	{
		// проверим, нужно ли ловить эту форму
		if (!/^ajax$/i.test(this.getAttribute("target"))) return
		
		form = this
		
		// поиграем
		Programica.FormPoster.bakeEvents(this, ["onload", "onsuccess", "onerror"])
		
		// собственно отправляем данные
		with (aPost(this.action, form2hash(this)))
		{
			onLoad		= function () { form.onload({request:this}) }
			onSuccess	= function () { form.onsuccess({request:this}) }
			onError		= function () { form.onerror({request:this}) }
		}
		
		// не даем форме отправиться (кое-как работает в ИЕ нашими стараниями)
		e.preventDefault()
	}
	
	node.addEventListener('submit', submit_listener, false)
}


Programica.FormPoster.prototype.Handler.prototype =
{
	init: function () { /*пусто*/ }
}


//Programica.FormPoster.code2event = function (code) { return eval("[function (event) { " + code + " }]")[0] }
Programica.FormPoster.bakeEvents = function (node, events)
{
	for (var i = 0; i < events.length; i++)
		node[events[i]] = eval("[function (event) { " + form.getAttribute(events[i]) + " }]")[0]
}


Programica.Widget.register(new Programica.FormPoster())
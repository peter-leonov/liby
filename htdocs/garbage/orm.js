
function ORM (c,props)
{
	// создаем новый класс
	var orm = function (num)
	{
		this.num = num
		this.id = this.klass.id + ':' + num
	}
	
	Object.extend(orm, ORM.base)
	
	// задаем свойства для элементов этого класса
	orm.props = props
	// храним имя класса для потомков
	orm.name = c
	// готовим ид для класса
	orm.id = c.replace(/\./g, '-')
	// имя тега такое же
	orm.tagName = orm.id
	
	// раширяем полезностью
	orm.prototype = {}
	Object.extend(orm.prototype, ORM.base.prototype)
	orm.prototype.klass = orm
	
	return orm
}

ORM.antiCacheString = function () { return (new Date()).getTime().toString() + Math.random().toString() }

ORM.base = function () { throw new Error('Can`t create instanse of abstract class') }

ORM.base.rpc = ORM.base.rpc_get = function (func, data)
{
	return ORM.call(sGet, this.id, func, {json: Object.toJSON(data), rnd: ORM.antiCacheString()})
}

ORM.base.rpc_post = function (func, data)
{
	return ORM.call(sPost, this.id, func, {json: Object.toJSON(data)})
}

// реализуем создание (для класса)
ORM.base.create = function (data)
{
	// проверим, ждет ли пользователь обатно массив
	// созданных объектов
	data = data || {} // если ничего не передал, то точно не хочет
	var wantArray = data.constructor == Array;
	
	// если передан не массив, нарочно оборачиваем в массив
	if (!wantArray)
		data = data ? [data] : []
	
	for (var i = 0; i < data.length; i++)
		data[i] = this.filterOut(data[i])
	
	// просим сервер насоздавать нам объектов
	var r = this.rpc_post('json_create', data)
	
	if (!r)
		return wantArray ? [] : null
	
	// сюда будем складывать новые объекты
	var res = []
	
	// перебираем иды вновь созданных объектов
	for (var i = 0; i < data.length; i++)
	{
		// нам приходят иды, парсим их бессовестно
		var kn = ORM.idToKlassNum(r[i])
		
		if (kn)
		{
			// собственно яваскрипт-объект
			var o = new this(kn.num)
			// заполняем объект нашими данными
			o.inject(data[i])
			
			res[i] = o
		}
		else
		{
			log('Error creating object for ' + this.id + ' with data: ', data[i])
			res[i] = null
		}
		
		
	}
	
	// передали массив, соответственно, массив и возвращаем
	return wantArray ? res : res[0]
}

// превращаем сырые данные (обычно из реквеста)
// в удобную для нас форму
ORM.base.filterIn = function (data, props)
{
	props = (props || this.props)
	
	var res = {}
	
	// конвертируем
	for (var i in props)
		if (data[i] != undefined)
			res[i] = (props[i].type.ormFilterIn ? props[i].type.ormFilterIn(data[i]) : data[i])
	
	return res
}
	
// превращаем удобные для нас данные (обычно из объекта)
// в удобную для передачи форму
ORM.base.filterOut = function (data, props)
{
	props = (props || this.props)
	
	var res = {}
	
	// конвертируем
	for (var i in props)
		if (data[i] != undefined)
			res[i] = (props[i].type.ormFilterOut ? props[i].type.ormFilterOut(data[i]) : data[i])
	
	return res
}

// реализуем загрузку (для класса)
ORM.base.load = function (num)
{
	// собственно яваскрипт-объект
	var o = new this(num)
	
	// жанглируем пустым объектом
	var r = o.rpc('json_load')
	if (!r)
		return null
	
	// заполняем пустой "o" данными из "r"
	o.inject(this.filterIn(r))
	
	return o
}

// выборка объектов — это еще не поиск :)
ORM.base.find = ORM.base.find_objects = function ()
{
	// перенаправим вызов в наш маленький парсер запросов
	var arr = this.find_parse_request.apply(this, arguments)
	
	// ищем объекты
	var data = this.rpc('json_find', arr)
	
	if (!data)
		throw new Error('Error finding objects ' + this.id + ' with ' + Object.toJSON(arr))
	
	var res = []
	for (var i = 0; i < data.length; i++)
	{
		// полученный хеш объекта
		var obj = data[i]
		
		// создаем объект нужного класса
		var o = new this(obj.num)
		
		// заполняем его данными, пропущенными через фильтр
		o.inject(this.filterIn(obj))
		
		// добавляем готовый к употреблению объект к результатам
		res.push(o)
	}
	return res
}

ORM.base.find_ids = function ()
{
	// перенаправим вызов
	var arr = this.find_parse_request.apply(this, arguments)
	
	var data = this.rpc('json_find_ids', arr)
	
	if (!data)
		throw new Error('Error finding ids ' + this.id + ' with ' + Object.toJSON(arr))
	
	return data
}

// выборка объектов — это еще не поиск :)
ORM.base.find_parse_request = function ()
{
	var arr = []
	
	// нет аргументов, или первый аргумент пустой
	if (arguments.length == 0 || arguments[0] == undefined)
		throw new Error ('Not enough arguments for find')
	
	// если аргументов много
	if (arguments.length > 1)
		// передадим их как они есть
		for (var i = 0; i < arguments.length; i++)
			arr.push(arguments[i])
	// если аргумент один
	else
	{
		// если строка — разделим по пробелам
		if (arguments[0].constructor == String)
			arr = arguments[0].split(/\s+/)
		// если массив — оставим как есть
		else if (arguments[0].constructor == Array)
			arr = arguments[0]
		else
			// а третьего не дано
			throw new Error('Invalid only argument: ' + arguments[0])
	}
	
	return arr
}


// собственно выполняет вызов процедуры
ORM.call = function (method, id, func, data)
{
	var r = method('/srpc/' + id + '/' + func, data)
	
	// пока без обработки ошибок
	if (r.status() >= 300)
		return null
	else
		return eval("[" + r.responseText() + "]")[0]
}

// парсит иды
ORM.idToKlassNum = function (id)
{
	var arr = (/([\w\_\-]+)(:(\w+))?/.exec(id))
	if (!arr || !arr[1])
		return null
	
	var path = arr[1].split(/-/)
	var num = arr[3]
	
	var klass = self
	
	for (var i = 0; i < path.length; klass = klass[path[i]], i++)
		if(!klass)
			return null
	
	return { klass:klass, num:num }
}

// загружает объект по иду
ORM.$ = ORM.getElementById = function (id)
{
	var kn = this.idToKlassNum(id)
	
	if (!kn)
		return null
	
	return kn.klass.load(kn.num)
}

ORM.base.prototype =
{
	// реализуем сохранение (для объекта)
	save: function (props)
	{
		props = props || this.klass.props
		
		var send = {}
		
		// фильтруем исходящие данные
		var data = this.klass.filterOut(this)
		//log(data)
		// копируем для отправки
		for (var p in props)
			send[p] = data[p]
		
		// отправляем данные на сервер обычным urlencoded'ом
		if (!this.rpc_post('json_save', send))
			log("Unsuccessful save request for " + this.id + " with data followed", send)
		
		return this
	},
	
	reload: function ()
	{
		return this.klass.load(this.num)
	},
	
	// получение списка вложенных объектов
	childNodes: function ()
	{
		// получаем объекты
		var data = this.rpc('json_child_nodes')
		
		if (!data)
			throw new Error('Error receiving objects from ' + this.id)
		
		var res = []
		for (var i = 0; i < data.length; i++)
		{
			// сырые данные найденного объекта
			var obj = data[i]
			
			// получаем его класс-номер
			var kn = obj.id.idToKlassNum()
			
			// создаем объект полученного класса с полученным номером
			var o = new kn.klass(kn.num)
			
			// заполняем объект
			o.inject(this.klass.filterIn(obj))
			
			// добавляем объект к результатам
			res.push(o)
		}
		return res
	},
	
	// добавление нодов в объект
	appendChild: function (child)
	{
		if (arguments.length != 1)
			throw new Error('Error number of arguments passed for appendChild (one needed)')
		
		var id = ""
		
		if (child.constructor == Object)
			id = child.id
		else if (child.constructor == String)
			id = child
		else
			throw new Error('Error type of argument passed to appendChild (String or Object needed)')
		
		// добавляем объект
		var res = this.rpc_post('json_append_child', id)
		
		if (res == undefined)
			throw new Error('Error adding child to object ' + this.id)
		
		return child
	},
	
		// добавление нодов в объект
	removeChild: function (child)
	{
		if (arguments.length != 1)
			throw new Error('Error number of arguments passed for appendChild (one needed)')
		
		var id = ""
		
		if (child.constructor == Object)
			id = child.id
		else if (child.constructor == String)
			id = child
		else
			throw new Error('Error type of argument passed to appendChild (String or Object needed)')
		
		// удаляем объект
		var res = this.rpc_post('json_remove_child', id)
		
		if (res == undefined)
			throw new Error('Error removing child from object ' + this.id)
		
		return child
	},
	
	// "впитываем" переданные свойства
	inject: function (data, props)
	{
		props = (props || this.klass.props)
		
		// копируем
		for (var i in props)
			if (data[i] != undefined)
				this[i] = data[i]
		
		return data
	},
	
	// генерит простую форму с данными объекта
	giveEditForm: function (props)
	{
		props = props || this.klass.props
		
		// $E — аналог document.createElement
		var form = $E('form')
		
		// для всех свойств
		for (var i in props)
		{
			// создадим лейбл
			var label = $E('label')
			label.appendChild($E('span')).appendChild(document.createTextNode(props[i].name))
			
			// в него инпут
			var input = $E('input', { type: 'text', name: i })
			input.value = this[i] || ''
			label.appendChild(input)
			
			// а лейбл в форму
			form.appendChild(label)
		}
		
		// ну и кнопочку отправки не забудем
		form.appendChild($E('label')).appendChild($E('input', { type: 'submit', value: 'save' }))
		
		// события, дополнительные ноды и стили
		// оставим на совести разработчика ;)
		
		return form
	},
	
	// строит простой домик на основе свойств объекта
	toDOM: function (props)
	{
		// у root удобно спросить innerHTML, у него один потомок
		// а больше он ни для чего и не нужен
		var root = document.createElement('root')
		
		// представляющаяя наш объект нода
		var me = root.appendChild(document.createElement(this.klass.tagName))
		
		// строим дерево по переданным свойствам
		// или по свойствам класса
		for (var p in (props || this.klass.props))
		{
			me.appendChild(document.createElement(p))
				// пока все свойства объекта
				// тупо вставляются в тектовые ноды
				.appendChild(document.createTextNode(this[p]))
		}
		
		root.toString = function () { return this.innerHTML }
		
		return root
	},
	
	// класс в виде строки становится своим идом
	toString: function () { return this.id },
	
	rpc_post: ORM.base.rpc_post,
	rpc_get: ORM.base.rpc_get,
	rpc: ORM.base.rpc
}

modCocktails = ORM
(
	'modCocktails',
	{
		name: {type: String, name: 'Название'},
		content: {type: String, name: 'Содержимое'}
	}
)

String.prototype.idToKlassNum = function () { return ORM.idToKlassNum(this) }
String.prototype.idToObject   = function () { return ORM.getElementById(this) }


//——————————————————————————————————————————————————————————————————————————————
// фильтры ввода-вывода ;)

// для объекта
Object.ormFilterIn = function (val) { return ORM.getElementById(val) }
Object.ormFilterOut = function (obj) { return obj.id }


//——————————————————————————————————————————————————————————————————————————————
// типы

// текст для нас это строка
var Text = String;

// картинка — отдельная песня
function Image ()
{
	this.klass = Image
}

Image.prototype =
{
	giveNode: function ()
	{
		return $E('img', {src:this.href})
	}
}

Image.ormFilterIn = function (data)
{
	var o = new this()
	
	// тупо копируем
	Object.extend(o, data)
	return o
}

Image.ormFilterOut = function (data)
{
	// сейчас мы не умеем работать с файлами из браузера
	return null
}

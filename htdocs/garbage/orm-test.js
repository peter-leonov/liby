
function async (code) { setTimeout(code, async.time = async.time ? async.time + 1000 : 500) }

function print (str) { $('tests').innerHTML += str }

function ok (res, text)
{
	$('tests').innerHTML += ('<div>' + (res ? '<span class="ok">ok<\/span>' : '<span class="error">error<\/span>') + (text && ': ' + text) + '<\/div>')
	return res
}

function test ()
{
	try
	{
		// работа со строками-идами
		ok(''.idToKlassNum, 'у строк должен быть метод idToKlassNum')
		var klass = 'Inshaker-Cocktail'.idToKlassNum().klass
		ok(klass, 'парсим "Inshaker-Cocktail"')
		
		
		// создание
		var new_obj = klass.create()
		ok(new_obj, 'создается ли объект: ' + new_obj)
		ok(klass.create({name:'Имя', content:'Описание'}).content == 'Описание', 'создание одного объекта за запрос')
		var res = klass.create([{name:'Еще имя', content: 'И еще описание'},{name: 'аааа', content: 'бббб'}])
		ok(res[0].content == 'И еще описание' && res[1].content == 'бббб', 'создание кучи объектов за запрос')
		
		ok(klass.create().num != klass.create().num, 'у двух объектов созданных подряд должны быть разные номера')
		
		var obj_name = 'Супер мега name'
		var obj = klass.create({name:obj_name})
		
		ok(obj.num, 'у созданного объекта должен быть свой номер (' + obj.num + ')')
		
		
		// загрузка
		var again_obj = obj.reload()
		
		ok(again_obj.name == obj_name && obj.name == obj_name, 'загруженные данные должны совпадать с ранее сохраненными: ' + [again_obj.name, obj.name, obj_name].join(', '))
		
		
		
		// сохранение
		again_obj.name = 'новое имя'
		again_obj.save()
		ok(again_obj.name == 'новое имя', 'сохраняем поле "' + again_obj.name + '" (до загрузки: ' + again_obj.id + ')')
		again_obj = again_obj.reload()
		ok(again_obj.name == 'новое имя', 'сохраняем поле "' + again_obj.name + '" (после загрузки: ' + again_obj.id + ')')
		
		// выборка
		var error = false
		try { Inshaker.Cocktail.find({}) } catch (ex) { error = true }
		ok(error, 'find должен принимать единственным параметром только массив или строку (["name", "like", "%адя%"] или "name like %адя%")')
		
		var args = Inshaker.Cocktail.find_parse_request("name like %адя%")
		ok(args[0] == 'name' && args[1] == 'like' && args[2] == '%адя%', 'find_parse_request должен распарсить строку "name like %адя%" в соответствующий массив: ' + Object.toJSON(args))
		
		
		var arr = Inshaker.Cocktail.find_ids('name', 'like', '%имя%')
		if (ok(arr, 'выборка объектов (find_ids) должна возвращать полезное значение'))
			ok(arr.constructor == Array, 'выборка объектов должна возвращать массив')
		
		arr = Inshaker.Cocktail.find('name', 'like', '%имя%')
		if (ok(arr, 'выборка объектов (find) должна возвращать полезное значение'))
		{
			ok(arr.constructor == Array, 'выборка объектов должна возвращать массив')
			ok(arr.length, 'массив не должен быть пустой')
			ok(arr[0].giveEditForm(), 'выборка объектов, как следует из названия, должна возвращать объекты')
		}
		
		
		// получение/добавление детей
		var root = modSite.load(1)
		ok(root, 'загрузка корня для добавления')
		var children = root.childNodes()
		ok(children.constructor == Array, 'childNodes возвращает массив')
		var child = Page.create()
		ok(!children[children.length-1] || children[children.length-1].id != child.id, 'последний чилд пока не наш')
		root.appendChild(child)
		var children = root.childNodes()
		//log(child, children)
		ok(children[children.length-1] && children[children.length-1].id == child.id, 'а теперь наш')
		root.removeChild(child)
		children = root.childNodes()
		ok(!children[children.length-1] || children[children.length-1].id != child.id, 'а теперь не наш')
	}
	catch (ex)
	{
		print('<span style="color:red">' + ex + '</span>')
		throw ex
	}
	finally
	{
		print('<p>done</p><hr/>')
	}
}

function test_cocktails ()
{
	try
	{
		var mcls = modCoctails.load(1)
		if (!mcls)
		{
			mcls = modCoctails.create()
			var msite = modSite.load(1)
			msite.appendChild(mcls)
		}
		ok(mcls.id == 'modCoctails:1', 'загружаем или создаем modCoctails:1 (' + mcls.id + ')')
		
		var cock = Inshaker.Cocktail.create()
		ok(cock.id, 'создаем коктейль')
		ok(mcls.appendChild(cock), 'добавляем коктейль в modCoctails:1')
		
		var port = Inshaker.Portion.create()
		{
			var err = null
			try { mcls.appendChild(port) }
			catch (ex) { err = ex }
			finally { ok(err, 'не должно удаваться добавлять части в список коктейлей (' + err + ')') }
		}
		
		ok(cock.appendChild(port), 'добавляем часть (' + port.id + ') в коктейль (' + cock.id + ')')
		
		var ingry = Inshaker.Ingredient.create({name: 'Водка', content: 'Что ж еще?'})
		
		ok(port.ingredient = ingry, 'присваиваем ингредиент (' + ingry.id + ') свойству порции (' + port.id + ')')
		ok(port.save(), 'сохраняем порцию')
		ok(port = port.reload(), 'загружаем сохраненную порцию')
		ok(port.ingredient && (port.ingredient.id == ingry.id), 'ингредиент должен успешно сохраниться (' + (port.ingredient && port.ingredient.id) + ')')
		
		ok(port = Inshaker.Portion.create({ingredient:ingry}), 'создаем порцию со свойством-объектом')
		ok(port = port.reload(), 'загружаем сохраненную порцию')
		ok(port.ingredient && (port.ingredient.id == ingry.id), 'ингредиент должен успешно сохраниться (' + (port.ingredient && port.ingredient.id) + ')')
		
		var step = Inshaker.Step.load(1)
		if (step.photo)
		{
			//log(step.photo)
			step.save()
			step = step.reload()
			
			ok(step.photo.href, 'сохранение не стирает картинки')
			
			document.body.appendChild(step.photo.giveNode())
		}
		else
		{
			log(step.photo)
		}
	}
	catch (ex)
	{
		print('<span style="color:red">' + ex + '</span>')
		throw ex
	}
	finally
	{
		print('<p>done</p><hr/>')
	}
}
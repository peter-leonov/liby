;(function(){

var doc = document, outputNode

function startup ()
{
	outputNode = doc.createElement('ul')
	outputNode.id = 'tests-output'
	document.body.appendChild(outputNode)
}

function node (cn, m)
{
	var row = doc.createElement('li')
	row.className = cn
	row.appendChild(doc.createTextNode(m))
	outputNode.appendChild(row)
}

window.addEventListener('load', startup, false)

var times = {}

var myName = 'tests', Me = self[myName] =
{
	ok: function (v, m) { v ? node('ok', m) : node('error', m) },
	info: function (m) { node('info', m) },
	
	time: function (name)
	{
		return times[name] = new Date()
	},
	
	timeEnd: function (name)
	{
		var date = new Date(),
			diff = date - times[name]
		this.info(name + ': ' + diff + 'ms')
		return diff
	},
	
	done: function () {  }
}

})();

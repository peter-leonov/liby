// inspired by RequireJS (http://requirejs.org/) by James Burke (http://twitter.com/jrburke)
;(function(){

var myName = 'require',
	states = {}

function run (callbacks, data)
{
	for (var i = 0, il = callbacks.length; i < il; i++)
		callbacks[i](data)
}

function Me (name, f)
{
	var src = Me.names[name] || name
	
	var state = states[src]
	
	if (state)
	{
		if (state.loaded)
			window.setTimeout(function () { run([f], state.data) })
		else
			state.callbacks.push(f)
	}
	else
	{
		state = states[src] = {callbacks: [f]}
		
		function onload ()
		{
			if (state.loaded)
				return
			state.loaded = true
			state.data = Me.lastData
			
			run(state.callbacks, state.data)
		}
		
		var script = state.node = Me.rootNode.appendChild(document.createElement('script'))
		script.addEventListener('load', onload, false)
		script.src = src
	}
	
	return state.node
}

Me.data = function (data)
{
	this.lastData = data
}

Me.names = {}
Me.rootNode = document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0] || document.documentElement

Me.className = myName
self[myName] = Me

})();

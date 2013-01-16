// inspired by RequireJS (http://requirejs.org/) by James Burke (http://twitter.com/jrburke)
;(function(){

var states = {}

function run (callbacks, data)
{
	for (var i = 0, il = callbacks.length; i < il; i++)
		callbacks[i](data)
}

function require (name, f)
{
	var src = require.names[name] || name
	
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
			state.data = require.lastData
			
			run(state.callbacks, state.data)
		}
		
		var script = state.node = require.rootNode.appendChild(document.createElement('script'))
		script.addEventListener('load', onload, false)
		script.src = src
	}
	
	return state.node
}

require.data = function (data)
{
	this.lastData = data
}

require.names = {}
require.rootNode = document.getElementsByTagName('head')[0]

self.require = require

})();

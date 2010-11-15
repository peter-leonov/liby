// inspired by RequireJS (http://requirejs.org/) by James Burke (http://twitter.com/jrburke)
;(function(){

var myName = 'require',
	states = {}

function run (callbacks)
{
	for (var i = 0, il = callbacks.length; i < il; i++)
		setTimeout(callbacks[i], 0)
}

function Me (name, f)
{
	var src = Me.names[name] || name
	
	var state = states[src]
	
	if (state)
	{
		if (state.loaded)
			run([f])
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
			
			run(state.callbacks)
		}
		
		script = state.node = Me.rootNode.appendChild(document.createElement('script'))
		script.addEventListener('load', onload, false)
		script.src = src
	}
	
	return state.node
}

Me.names = {}
Me.rootNode = document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0] || document.documentElement

Me.className = myName
self[myName] = Me

})();
// inspired by require.js (http://requirejs.org/) by James Burke (http://www.blogger.com/profile/00451746837849321739)
;(function(){

var myName = 'require',
	states = {}

function run (callbacks)
{
	for (var i = 0, il = callbacks.length; i < il; i++)
		setTimeout(callbacks[i], 0)
}

function Me (src, f)
{
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
		
		script = state.node = Me.rootNode.appendChild(document.createElement('script'))
		script.addEventListener('load', function () { state.loaded = true; run(state.callbacks) }, false)
		script.src = src
	}
	
	return state.node
}

Me.rootNode = document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0] || document.documentElement

Me.className = myName
self[myName] = Me

})();
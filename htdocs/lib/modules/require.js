// inspired by require.js (http://requirejs.org/) by James Burke (http://www.blogger.com/profile/00451746837849321739)
;(function(){

var myName = 'require'

function Me (src, f)
{
	var script = Me.rootNode.appendChild(document.createElement('script'))
	script.addEventListener('load', f, false)
	script.src = src
	
	return script
}

Me.rootNode = document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0] || document.documentElement

Me.className = myName
self[myName] = Me

})();
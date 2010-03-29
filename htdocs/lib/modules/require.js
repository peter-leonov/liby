// inspired by require.js (http://requirejs.org/) by James Burke (http://www.blogger.com/profile/00451746837849321739)
;(function(){

var myName = 'require'

function getRoot ()
{
	return document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0] || document.documentElement
}

function Me (src, f)
{
	var root = getRoot()
	if (!root)
		throw new Error('can not get root node to append a script to')
	
	var script = root.appendChild(document.createElement('script'))
	script.addEventListener('load', f, false)
	script.src = src
	
	return script
}

Me.className = myName
self[myName] = Me

})();
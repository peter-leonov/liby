;(function(){

if (!window._gaq)
	window._gaq = []

var Me =
{
	load: function ()
	{
		// untouched inclusion snippet
		var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
		ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
		var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
	},
	
	_push: function (a)
	{
		window._gaq.push(a)
	},
	
	push: function (a)
	{
		this.load()
		this.push = this._push
		this.push(a)
	}
}

Me.className = 'GoogleAnalytics'
self[Me.className] = Me

})();

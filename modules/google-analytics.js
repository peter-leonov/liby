;(function(){

// Don't cache _gaq array as it'll be replaced with
// another object on GA load.
if (!window._gaq)
	window._gaq = []

var Me =
{
	setAccount: function (a) { this.account = a },
	
	load: function ()
	{
		if (this.included)
			return
		this.included = true
		
		// must be called before any other event tracking
		window._gaq.push(['_setAccount', this.account])
		
		// untouched inclusion snippet
		var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
		ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
		var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
	},
	
	push: function (a)
	{
		this.load()
		window._gaq.push(a)
	}
}

Me.className = 'GoogleAnalytics'
self[Me.className] = Me

})();

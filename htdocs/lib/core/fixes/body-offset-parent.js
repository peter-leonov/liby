if (/Opera\/(9\.[5-9]|10\.)/.test(navigator.userAgent))
	window.addEventListener('load', function (e) { document.body.offsetParent = document.documentElement }, false)

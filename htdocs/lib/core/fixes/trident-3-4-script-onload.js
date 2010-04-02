(function(){

var prototype = HTMLScriptElement.prototype

var addEventListener = prototype.addEventListener
HTMLScriptElement.prototype.addEventListener = function (type, func, dir)
{
	if (type == 'load')
	{
		var me = this
		function onreadystatechange (e)
		{
			if (me.readyState == 'loaded')
			{
				var ne = document.createEvent('Event')
				ne.initEvent('load', false, true)
				if (!this.dispatchEvent(ne))
					e.preventDefault()
			}
		}
		addEventListener.call(this, 'readystatechange', onreadystatechange, dir)
	}
	
	return addEventListener.call(this, type, func, dir)
}

})();
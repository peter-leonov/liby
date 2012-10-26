if (/Opera\/9\.[0123456]|Opera\/.+Version\/1[01]\.|Chrome\/[123456789]\.|Version\/[345]\..+Safari/.test(navigator.userAgent))
(function(){

// warn a developer
try { console.log('emulating onerror') } catch (ex) {}
try { opera.postError('emulating onerror') } catch (ex) {}

function wrap (callback)
{
	var wrapper = callback.__onerror_wrapper
	if (!wrapper)
	{
		wrapper = callback.__onerror_wrapper = function ()
		{
			try
			{
				return callback.apply(this, arguments)
			}
			catch (ex)
			{
				if (typeof window.onerror === 'function')
					if (window.onerror(ex.message, ex.sourceURL, ex.line))
						return
				
				throw ex
			}
		}
	}
	
	return wrapper
}

var setTimeout = window.setTimeout
window.setTimeout = function (callback, timeout) { return setTimeout.call(window, wrap(callback), timeout) }

var setInterval = window.setInterval
window.setInterval = function (callback, timeout) { return setInterval.call(window, wrap(callback), timeout) }

var addEventListener = Element.prototype.addEventListener
Element.prototype.addEventListener = function (type, callback, dir) { return addEventListener.call(this, type, wrap(callback), dir) }

var removeEventListener = Element.prototype.removeEventListener
Element.prototype.removeEventListener = function (type, callback, dir) { return removeEventListener.call(this, type, wrap(callback), dir) }

})();

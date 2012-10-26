package
{

import flash.display.Sprite
import flash.external.ExternalInterface
import flash.net.SharedObject

public class proxy extends Sprite
{
	public function proxy ()
	{
		function getSO ()
		{
			return SharedObject.getLocal('client-storage')
		}
		
		function getItem (k)
		{
			var so = getSO()
			return so.data[k]
		}
		
		function setItem (k, v)
		{
			var so = getSO()
			so.data[k] = v
			so.flush()
		}
		
		function removeItem (k)
		{
			var so = getSO()
			delete so.data[k]
			so.flush()
		}
		
		function length ()
		{
			return keys().length
		}
		
		function keys ()
		{
			var so = getSO()
			var keys = []
			for (var k in so.data)
				keys.push(k)
			return keys
		}
		
		function clear ()
		{
			getSO().clear()
		}
		
		ExternalInterface.addCallback('getItem', getItem)
		ExternalInterface.addCallback('setItem', setItem)
		ExternalInterface.addCallback('removeItem', removeItem)
		ExternalInterface.addCallback('length', length)
		ExternalInterface.addCallback('keys', keys)
		ExternalInterface.addCallback('clear', clear)
		
		ExternalInterface.call('document.getElementById("' + ExternalInterface.objectID + '").onready')
	}
}

}
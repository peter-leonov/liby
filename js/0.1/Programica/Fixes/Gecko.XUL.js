// some fixes for XULElement

if (self.XULElement)
{
	// XUL does not implement scrollLeft nor scrollTop, so emulating them via getters/setters
	XULElement.prototype.__boxInterfaceGetter = function ()
	{
		try
		{
			this.__boxInterface = this.boxObject.QueryInterface(Components.interfaces.nsIScrollBoxObject)
		}
		catch (ex)
		{
			//console.error(ex)
			this.__boxInterface = null
		}
		
		this.__defineGetter__('boxInterface', function () { return this.__boxInterface })
		
		return this.__boxInterface
	}
	
	XULElement.prototype.__scrollTopGetter	= function ()
	{
		var h = {}
		try { this.boxInterface.getPosition({},h) } catch (ex) {  }
		return h.value
	}
	
	XULElement.prototype.__scrollLeftGetter	= function ()
	{
		var w = {}
		try { this.boxInterface.getPosition(w,{}) } catch (ex) {  }
		return w.value
	}
	
	XULElement.prototype.__scrollTopSetter	= function (v)
	{
		try { this.boxInterface.scrollTo(this.scrollLeft, Math.round(v)) } catch (ex) {  }
		return v
	}
	
	XULElement.prototype.__scrollLeftSetter	= function (v)
	{
		try { this.boxInterface.scrollTo(Math.round(v), this.scrollTop) } catch (ex) {  }
		return v
	}
	
	
	XULElement.prototype.__defineGetter__('boxInterface',  XULElement.prototype.__boxInterfaceGetter)
	XULElement.prototype.__defineGetter__('scrollTop',  XULElement.prototype.__scrollTopGetter)
	XULElement.prototype.__defineGetter__('scrollLeft', XULElement.prototype.__scrollLeftGetter)
	
	XULElement.prototype.__defineSetter__('scrollTop',  XULElement.prototype.__scrollTopSetter)
	XULElement.prototype.__defineSetter__('scrollLeft', XULElement.prototype.__scrollLeftSetter)
	
	// and emulating offset* too
	XULElement.prototype.__defineGetter__('offsetHeight',  function () { return this.boxObject.height })
	XULElement.prototype.__defineGetter__('offsetWidth', function () { return this.boxObject.width })
	XULElement.prototype.__defineGetter__('offsetLeft',  function () { return this.boxObject.x })
	XULElement.prototype.__defineGetter__('offsetTop', function () { return this.boxObject.y })
}

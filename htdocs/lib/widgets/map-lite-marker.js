;(function(){

var myName = 'MapLiteMarker',
	Me = self[myName] = Module(myName)

Me.prototype =
{
	initialize: function (map)
	{
		var node = this.node || (this.node = this.createNode())
		map.getPane(G_MAP_MARKER_PANE).appendChild(node)
		this.map = map
	},
	
	redraw: function (force)
	{
		if (!force)
			return
		
		var map = this.map, latlng = this.latlng, style = this.node.style,
			sw = map.fromLatLngToDivPixel(latlng)
		
		style.left = sw.x + "px";
		style.top = sw.y + "px";
	},
	
	remove: function () { this.node.remove() },
	copy: function () { return new this.constructor() }
}

})();

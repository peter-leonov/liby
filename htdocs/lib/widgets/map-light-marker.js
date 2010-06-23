;(function(){

var myName = 'MapLightMarker'

function Me () {}

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
		
		var sw = this.map.fromLatLngToDivPixel(this.latlng)
		
		var style = this.node.style
		style.left = sw.x + 'px'
		style.top = sw.y + 'px'
	},
	
	remove: function ()
	{
		this.node.remove()
	}
}

self[myName] = Me
Me.className = myName

})();

;(function(){

var myName = 'MapLightMarker'

function Me () {}

eval(NodesShortcut.include())

Me.prototype = new Map.Overlay()

var myProto =
{
	initialize: function (map)
	{
		var ll = this.ll
		this.latlng = new this.api.LatLng(ll.lat, ll.lng)
		
		var node = this.node || (this.node = this.createNode())
		map.getPane(G_MAP_MARKER_PANE).appendChild(node)
		this.map = map
	},
	
	createNode: function ()
	{
		return Nct('div', 'point', 'createNode() is not implemented')
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

Object.extend(Me.prototype, myProto)

self[myName] = Me
Me.className = myName

})();

;(function(){

var Papa

;(function(){

var myName = 'Map',
	Me = Papa = MVC.create(myName)

var myProto = 
{
	bind: function (nodes)
	{
		this.view.bind(nodes)
		return this
	},
	
	setCenter: function (center, zoom) { this.model.setCenter(center, zoom) },
	setPoints: function (points) { this.model.setPoints(points) },
	apiLoaded: function () { this.dispatchEvent('ready') }
}

Object.extend(Me.prototype, myProto)
Me.mixIn(EventDriven)

self[myName] = Me

})();


;(function(){

var Me = Papa.View

eval(NodesShortcut.include())

var myProto =
{
	initialize: function ()
	{
		this.nodes = {}
		this.markersCache = {}
		this.visibleMarkers = {}
	},
	
	bind: function (nodes)
	{
		this.nodes = nodes
		
		googleApiLoader.load('maps', 2)
		nodes.main.addClassName('loading')
		var me = this
		googleApiLoader.addEventListener('maps', function (e) { me.apiLoaded(e) }, false)
	},
	
	apiLoaded: function (e)
	{
		var api = this.api = e.api
		this.createMarkerClass()
		this.createMap()
		
		this.ready = true
		this.controller.apiLoaded()
	},
	
	createMap: function ()
	{
		var api = this.api, main = this.nodes.main,
			map, me = this
		
		main.removeClassName('loading')
		
		map = this.map = new api.Map2(main)
		api.Event.addListener(map, 'load', function () { me.mapLoaded(this) })
		map.enableContinuousZoom()
	},
	
	setCenter: function (center, zoom)
	{
		if (!this.ready)
			return
		
		this.map.setCenter(new this.api.LatLng(center.lat, center.lng), zoom)
	},
	
	mapLoaded: function ()
	{
		// log('mapLoaded')
		var me = this
		this.api.Event.addListener(this.map, 'moveend', function () { me.mapMoveEnd(this) })
		this.addControls()
	},
	
	addControls: function ()
	{
		var nodes = this.nodes,
			control = nodes.control
		
		if (!control)
		{
			var api = this.api, controlPosition = new api.ControlPosition(api.ANCHOR_TOP_LEFT, new api.Size(10, 15))
			this.map.addControl(new api.SmallMapControl(), controlPosition)
			return
		}
		
		var main = nodes.main,
			map = this.map
		
		main.appendChild(control)
		
		var actions =
		{
			top:    ['panDirection', 0, 1],
			right:  ['panDirection', -1, 0],
			bottom: ['panDirection', 0, -1],
			left:   ['panDirection', 1, 0],
			plus:   ['zoomIn'],
			minus:  ['zoomOut']
		}
		
		function move (e)
		{
			var action = actions[e.target.getAttribute('data-map-action')]
			if (action)
				map[action[0]].apply(map, action.slice(1))
		}
		
		control.addEventListener('mousedown', move, false)
	},
	
	createMarkerClass: function ()
	{
		if (!this.markerClass)
		{
			var klass = this.markerClass = function () {  },
				kp = klass.prototype = new this.api.Overlay()
			// kp.createNode = function () { return this.point.createNode() }
			klass.mixIn(MapLightMarker)
		}
	},
	
	mapMoveEnd: function (map)
	{
		var bounds = map.getBounds(), sw = bounds.getSouthWest(), ne = bounds.getNorthEast()
		this.controller.moved(map.getCenter(), map.getZoom(), {lat:sw.lat(), lng:sw.lng()}, {lat:ne.lat(), lng:ne.lng()})
	},
	
	pointClicked: function (point)
	{
		this.controller.pointInvoked(point)
	},
	
	renderPoints: function (points)
	{
		if (!this.ready)
			return
		
		var map = this.map,
			visible = this.visibleMarkers,
			now = this.visibleMarkers = {}
		
		// map.clearOverlays()
		// removeOverlay
		for (var i = 0; i < points.length; i++)
		{
			var point = points[i], pid = point.id
			
			// get the marker and insert it into the new visibleMarkers hash
			var marker = now[pid] = this.getGMarker(point)
			
			// add marker (and delete its record) only if it isn't already shown
			if (!visible[pid])
				map.addOverlay(marker)
			else
				delete visible[pid]
		}
		
		// remove all the markers that are still visible
		for (var k in visible)
			map.removeOverlay(visible[k])
	},
	
	getGMarker: function (point)
	{
		var cache = this.markersCache, marker
		if ((marker = cache[point.id]))
			return marker
		
		var latlng = point.latlng, api = this.api, me = this, node
		
		marker = cache[point.id] = new this.markerClass()
		marker.latlng = new this.api.LatLng(latlng.lat, latlng.lng)
		node = marker.node = point.createNode()
		node.addEventListener('mousedown', function (e) { e.stopPropagation(); me.pointClicked(point) }, false)
		return marker
	}
}

Object.extend(Me.prototype, myProto)

})();


;(function(){

var Me = Papa.Controller

var myProto = 
{
	moved: function (center, zoom, sw, ne)
	{
		this.parent.dispatchEvent({type:'moved', center:center, zoom:zoom, sw:sw, ne:ne})
	},
	
	pointInvoked: function (point)
	{
		this.model.pointInvoked(point)
	},
	
	apiLoaded: function () { this.model.apiLoaded(); this.parent.apiLoaded() }
}

Object.extend(Me.prototype, myProto)

})();


;(function(){

var Me = Papa.Model

var myProto =
{
	initialize: function ()
	{
		this.points = []
	},
	
	apiLoaded: function ()
	{
		this.view.setCenter(this.center, this.zoom)
		this.view.renderPoints(this.points)
	},
	
	setCenter: function (center, zoom)
	{
		this.center = center
		this.zoom = zoom
	},
	
	setPoints: function (points)
	{
		if (!this.parent.dispatchEvent({type:'pointsSet', points: points}))
			return
		
		this.points = points
		this.view.renderPoints(points)
	},
	
	pointInvoked: function (point)
	{
		this.parent.dispatchEvent({type:'pointInvoked', point: point})
	}
}

Object.extend(Me.prototype, myProto)

})();


})();
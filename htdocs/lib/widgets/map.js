;(function(){

var Papa

;(function(){

var myName = 'Map',
	Me = Papa = MVC.create(myName),
	MODE_SINGLE = Me.MODE_SINGLE = 0,
	MODE_MULTY = Me.MODE_SINGLE = 1

var myProto = 
{
	bind: function (main)
	{
		this.view.bind({main:main})
		return this
	},
	
	setMode: function (mode) { this.controller.setMode(mode) },
	setCenter: function (center, zoom) { this.model.setCenter(center, zoom) },
	setPoints: function (points) { this.model.setPoints(points) },
	selectPoint: function (point) { this.controller.selectPoint(point) },
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
		// var api = this.api, controlPosition = new api.ControlPosition(api.ANCHOR_TOP_LEFT, new api.Size(10, 15))
		// this.map.addControl(new api.SmallMapControl(), controlPosition)
		
		var main = this.nodes.main, map = this.map, control
		
		control = main.appendChild(Nc('div', 'position-control'))
		
		control.appendChild(Nc('div', 'to-top'))
		control.appendChild(Nc('div', 'to-right'))
		control.appendChild(Nc('div', 'to-bottom'))
		control.appendChild(Nc('div', 'to-left'))
		
		control.appendChild(Nc('div', 'to-plus'))
		control.appendChild(Nc('div', 'to-minus'))
		
		function move (e)
		{
			switch (e.target.className)
			{
				case 'to-top':
				map.panDirection(0, 1)
				break
				
				case 'to-right':
				map.panDirection(-1, 0)
				break
				
				case 'to-bottom':
				map.panDirection(0, -1)
				break
				
				case 'to-left':
				map.panDirection(1, 0)
				break
				
				case 'to-plus':
				map.zoomIn()
				break
				
				case 'to-minus':
				map.zoomOut()
				break
			}
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
	
	renderPoints: function (points, state)
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
			
			marker.node.toggleClassName('selected', !!state[point.id])
		}
		
		// remove all the markers that are still visible
		for (var k in visible)
			map.removeOverlay(visible[k])
	},
	
	updatePoint: function (point, state)
	{
		if (!this.ready)
			return
		
		var marker = this.getGMarker(point)
		marker.node.toggleClassName('selected', state)
	},
	
	getGMarker: function (point)
	{
		var cache = this.markersCache, marker
		if ((marker = cache[point.id]))
			return marker
		
		var latlng = point.latlng, api = this.api, me = this, node
		
		marker = cache[point.id] = new this.markerClass()
		marker.latlng = new GLatLng(latlng.lat, latlng.lng)
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
	
	setMode: function (mode) { this.model.setMode(mode) },
	selectPoint: function (point) { this.model.pointInvoked(point, true) },
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
		this.state = {}
		this.mode = 1
		this.pointsById = {}
	},
	
	setMode: function (mode) { this.mode = mode },
	
	apiLoaded: function ()
	{
		this.view.setCenter(this.center, this.zoom)
		this.view.renderPoints(this.points, this.state)
	},
	
	setCenter: function (center, zoom)
	{
		this.center = center
		this.zoom = zoom
	},
	
	setPoints: function (points)
	{
		this.points = points
		for (var i = 0; i < points.length; i++)
		{
			var point = points[i]
			this.pointsById[point.id] = point
		}
		this.fireModelChanged()
		this.view.renderPoints(points, this.state)
	},
	
	pointInvoked: function (point, status)
	{
		var view = this.view, state = this.state, id = point.id
		
		if (status === undefined)
			status = !state[id]
		
		if (!this.parent.dispatchEvent({type:'pointInvoked', point: point, status: status}))
			return false
		
		if (this.mode === MODE_MULTY)
		{
			if (status)
				state[id] = true
			else
				delete state[id]
		}
		else if (this.mode === MODE_SINGLE)
		{
			var pointsById = this.pointsById
			for (var k in state)
			{
				var p = this.pointsById[k]
				if (p !== point)
					view.updatePoint(p, false)
			}
			
			state = this.state = {}
			if (status)
				state[id] = status
		}
		
		this.fireModelChanged()
		view.updatePoint(point, status)
	},
	
	fireModelChanged: function ()
	{
		var byId = this.pointsById, state = this.state, selected = []
		
		for (var k in state)
			if (state[k])
			 	selected.push(byId[k])
		
		this.parent.dispatchEvent({type:'modelChanged', state: this.state, selected: selected})
	}
}

Object.extend(Me.prototype, myProto)

})();


})();
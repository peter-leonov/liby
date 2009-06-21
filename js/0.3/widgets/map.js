;(function(){

var myName = 'Map',
	Me = self[myName] = MVC.create(myName),
	MODE_SINGLE = Me.MODE_SINGLE = 0,
	MODE_MULTY = Me.MODE_SINGLE = 1


Me.prototype.extend
({
	bind: function (main, center, zoom)
	{
		this.view.bind({main:main}, center, zoom)
		this.todos = []
		return this
	},
	
	setMode: function (mode) { this.controller.setMode(mode) },
	setPoints: function (points) { this.model.setPoints(points) },
	selectPoint: function (point) { this.controller.selectPoint(point) },
	apiLoaded: function () { this.dispatchEvent('ready') }
})

Me.mixIn(EventDriven)

eval(NodesShortcut())

Me.View.prototype.extend
({
	initialize: function ()
	{
		this.nodes = {}
		this.markersCache = {}
		this.visibleMarkers = {}
	},
	
	bind: function (nodes, center, zoom)
	{
		this.nodes = nodes
		this.center = center
		this.zoom = zoom
		
		googleApiLoader.load('maps', 2)
		nodes.main.addClassName('loading')
		var me = this
		self.googleApiLoader.addEventListener('maps', function (e) { me.apiLoaded(e) }, false)
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
		map.setCenter(new api.LatLng(this.center.lat, this.center.lng), this.zoom)
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
		
		control = main.appendChild(N('div', 'position-control'))
		
		control.appendChild(N('div', 'to-top'))
		control.appendChild(N('div', 'to-right'))
		control.appendChild(N('div', 'to-bottom'))
		control.appendChild(N('div', 'to-left'))
		
		control.appendChild(N('div', 'to-plus'))
		control.appendChild(N('div', 'to-minus'))
		
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
			klass.mixIn(MapLiteMarker)
		}
	},
	
	mapMoveEnd: function (map)
	{
		var bounds = map.getBounds(), sw = bounds.getSouthWest(), ne = bounds.getNorthEast()
		log(map.getCenter().lat() + ', ' + map.getCenter().lng())
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
})

Me.Controller.prototype.extend
({
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
})

Me.Model.prototype.extend
({
	initialize: function () { this.state = {}; this.mode = 1; this.pointsById = {} },
	
	setMode: function (mode) { this.mode = mode },
	
	apiLoaded: function () { this.view.renderPoints(this.points, this.state) },
	
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
		status = status !== undefined ? !!status : !this.state[point.id]
		var view = this.view
		
		if (!this.parent.dispatchEvent({type:'pointInvoked', point: point, status: status}))
			return false
		
		if (this.mode === MODE_MULTY)
			this.state[point.id] = status
		else if (this.mode === MODE_SINGLE)
		{
			var pointsById = this.pointsById
			for (var k in this.state)
			{
				var p = this.pointsById[k]
				if (p !== point)
					view.updatePoint(p, false)
			}
			
			this.state = {}
			this.state[point.id] = status
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
})

})();
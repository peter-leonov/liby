;(function(){

var Papa

;(function(){

function Me ()
{
	var m = this.model = new Me.Model(),
		v = this.view = new Me.View(),
		c = this.controller = new Me.Controller()
	
	m.view = v
	v.controller = c
	c.model = m
	
	m.parent = v.parent = c.parent = this
}

Me.prototype = 
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

Me.mixIn(EventDriven)

Me.className = 'Map'
self[Me.className] = Papa = Me


})();


;(function(){

function Me () {}
Papa.Overlay = Me

})();


;(function(){

eval(NodesShortcut.include())

function Me ()
{
	this.nodes = {}
	this.visibleMarkers = {}
}

Me.prototype =
{
	bind: function (nodes)
	{
		this.nodes = nodes
		if (!nodes.wrapper)
			nodes.wrapper = nodes.main
		
		var me = this
		googleApiLoader.addEventListener('maps', function (e) { me.apiLoaded(e) }, false)
		googleApiLoader.load('maps', 2)
		nodes.wrapper.classList.add('loading')
	},
	
	apiLoaded: function (e)
	{
		var api = this.api = e.api
		this.updateOverlayProto()
		this.createMap()
		
		this.ready = true
		this.controller.apiLoaded()
	},
	
	createMap: function ()
	{
		var api = this.api
		
		var map = this.map = new api.Map2(this.nodes.main)
		var me = this
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
		var me = this
		this.nodes.wrapper.removeClassName('loading')
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
		
		control.addEventListener('click', move, false)
	},
	
	updateOverlayProto: function ()
	{
		var proto = Papa.Overlay.prototype,
			api = this.api
		
		Object.extend(proto, new api.Overlay())
		proto.api = api
	},
	
	mapMoveEnd: function (map)
	{
		var center = map.getCenter(),
			bounds = map.getBounds(),
			sw = bounds.getSouthWest(),
			ne = bounds.getNorthEast()
		
		this.controller.moved({lat:center.lat(), lng:center.lng()}, map.getZoom(), {lat:sw.lat(), lng:sw.lng()}, {lat:ne.lat(), lng:ne.lng()})
	},
	
	renderPoints: function (points)
	{
		if (!this.ready)
			return
		
		var map = this.map,
			visible = this.visibleMarkers,
			now = this.visibleMarkers = {}
		
		for (var i = 0; i < points.length; i++)
		{
			var point = points[i], pid = point.mapPointId
			
			// get the marker and insert it into the new visibleMarkers hash
			now[pid] = point
			
			// add marker (and delete its record) only if it isn't already shown
			if (!visible[pid])
				map.addOverlay(point)
			else
				delete visible[pid]
		}
		
		// remove all the markers that are still visible
		for (var k in visible)
			map.removeOverlay(visible[k])
	}
}

Papa.View = Me

})();


;(function(){

function Me () {}

Me.prototype = 
{
	moved: function (center, zoom, sw, ne)
	{
		this.parent.dispatchEvent({type:'moved', center:center, zoom:zoom, sw:sw, ne:ne})
	},
	
	apiLoaded: function () { this.model.apiLoaded(); this.parent.apiLoaded() }
}

Papa.Controller = Me

})();


;(function(){

function Me ()
{
	this.points = []
	this.count = 0
}

Me.prototype =
{
	apiLoaded: function ()
	{
		this.view.setCenter(this.center, this.zoom)
		this.view.renderPoints(this.points)
	},
	
	setCenter: function (center, zoom)
	{
		this.center = center
		this.zoom = zoom
		this.view.setCenter(center, zoom)
	},
	
	setPoints: function (points)
	{
		if (!this.parent.dispatchEvent({type:'pointsSet', points: points}))
			return
		
		var count = this.count
		for (var i = 0, il = points.length; i < il; i++)
		{
			var point = points[i]
			if (!point.mapPointId)
				point.mapPointId = ++count
		}
		this.count = count
		
		this.points = points
		this.view.renderPoints(points)
	}
}

Papa.Model = Me

})();


})();
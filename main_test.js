// declare the map variable here to give it a global scope
let myMap;

// we might as well declare our baselayer(s) here too
const CartoDB_Positron = L.tileLayer(
	'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', 
	{
		attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
	}
)

//add tilelayer
var OpenStreetMap_Mapnik = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
	maxZoom: 19,
	attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
});

//add the basemap style(s) to a JS object, to which you could also add other baselayers. This object is loaded as a basemap selector as seen further down
let baseLayers = {
	"CartoDB": CartoDB_Positron,
	"Tile_layer": OpenStreetMap_Mapnik
	//,...
};

function initialize() {
	loadMap();
};

function loadMap(mapId) {

	try {
		myMap.remove()
	} catch (e) {
		console.log(e)
		console.log("no map to delete")
	} finally {
		//put your map loading code in here

		if (mapId == 'mapa') {
			fetchData('https://raw.githubusercontent.com/geog-464/geog-464.github.io/main/Amtrak_Stations.geojson');
			myMap = L.map('mapdiv', {
				center: [45.5019, -73.5674]
				, zoom: 0
				, maxZoom: 20
				, minZoom: 3
				, layers: CartoDB_Positron
			});
		}
		if (mapId == 'mapb') {
			fetchData('https://raw.githubusercontent.com/geog-464/geog-464.github.io/main/megacities.geojson');
			myMap = L.map('mapdiv', {
				center: [45.5019, -73.5674]
				, zoom: 0
				, maxZoom: 20
				, minZoom: 3
				, layers: CartoDB_Positron
			});
		}
	}
	//now reassign the map variable by actually making it a useful object, this will load your leaflet map

	//declare basemap selector widget
	let lcontrol = L.control.layers(baseLayers);
	//add the widget to the map
	lcontrol.addTo(myMap);
};

function fetchData(url) {
	//load the data
	fetch(url)
		.then(function (response) {
			return response.json();
		})
		.then(function (json) {
			//create a Leaflet GeoJSON layer using the fetched json and add it to the map object
			L.geoJson(
				json,
				{
					style: styleAll,
					pointToLayer: generateCircles,
					onEachFeature: addPopups,
				},

			).addTo(myMap);
		})
};

function generateCircles(feature, latlng) {
	return L.circleMarker(latlng);
}

function styleAll(feature, latlng) {
	// console.log(feature.properties.ZipCode);

	var styles = { dashArray: null, dashOffset: null, lineJoin: null, lineCap: null, stroke: false, color: '#000', opacity: 1, weight: 1, fillColor: null, fillOpacity: 0 };

	if (feature.geometry.type == "Point") {
		styles.fillColor = '#fff'
			, styles.fillOpacity = 0.5
			, styles.stroke = true
			, styles.radius = 9
	}
	if (typeof feature.properties.ZipCode == 'string') {
		styles.fillColor = 'cyan'
	}

	return styles;
}

function onEachFeatureClosure(mapId) {
	return function OnEachFeature(feature, layer) {
		addPopups(mapId)
	}
}

function addPopups(feature, layer) {
	if (feature.properties.StationNam != undefined) {
		layer.bindPopup(feature.properties.StationNam);
	}
	else (layer.bindPopup(feature.properties.city))
}


var mapSelect = document.getElementById('mapdropdown');

mapSelect.addEventListener("change", (event) => {
	loadMap(mapSelect.value)
});
$(document).ready(function(){
	var map;
	var mousePosition;
	var iconFeatures=[];
	var vectorSource;
	var iconStyle;
	var vectorLayer;
	
	// Create a new map 
    map = new ol.Map({
		target: document.getElementById('map'),
        layers: [
			new ol.layer.Tile({
				source: new ol.source.OSM()
			})
		],
        view: new ol.View({
          center: ol.proj.fromLonLat([0, 25]),
          zoom: 2
        })
    });
    
    // Define mouse position control  
    mousePosition = new ol.control.MousePosition({
		coordinateFormat: function(coordinate){
			return ol.coordinate.format(coordinate, '{y}, {x}', 6);
		},
        projection: 'EPSG:4326',
        projection: 'EPSG:4326',
        target: document.getElementById('myposition'),
        undefinedHTML: '&nbsp;'
    });
    
	// VectorSource for marker
	vectorSource = new ol.source.Vector({
		features: iconFeatures
		});
	
	// Icon style for marker
	iconStyle = new ol.style.Style({
		image: new ol.style.Icon(/** @type {olx.style.IconOptions} */ ({
			anchor: [18, 36],
			anchorXUnits: 'pixels',
			anchorYUnits: 'pixels',
			opacity: 0.75,
			src: './marker.png'
		}))
	});
	
	// Layer for marker
	vectorLayer = new ol.layer.Vector({
	source: vectorSource,
	style: iconStyle
	});
	
	// Map addons
	map.addLayer(vectorLayer);
	map.addControl(mousePosition);
	
	//******************************************************************
	//	EVENT LISTENER
	//******************************************************************
	
	// Add marker by input form 
	$('.gps').on('change', function(){
		lon = Number($('#lon').val());
		lat = Number($('#lat').val());
		if(!isNaN(lat) && !isNaN(lon)){ 
			map.setView(new ol.View({
				zoom: 4,
				center:ol.proj.fromLonLat([lon,lat])
			
			}));
		addPOI(lat,lon);	
		};		
	});
	
	// Input field filled when dblclick on map
	map.on('dblclick', function(){
		iconFeatures.pop();
		var gps =  $('.ol-mouse-position').text().split(',');
		$('#lat').val(Number(gps[0]));
		$('#lon').val(Number(gps[1]));
		addPOI(Number(gps[0]),Number(gps[1]));
	});
	
	
	//******************************************************************
	//	FUNCTIONS
	//******************************************************************
	
	// Function to add Poin Of Interest marker on map
	function addPOI(lat,lon){
		var iconFeature = new ol.Feature({
			geometry: new ol.geom.Point(ol.proj.transform([lon, lat], 'EPSG:4326', 'EPSG:3857')),
			latlon : lat+'; '+lon
		});
		iconFeatures.push(iconFeature);
		mapRefresh();

	};	
	
	// Refresh map	
	function mapRefresh(){
		if (vectorLayer) {
			map.removeLayer(vectorLayer);
		};
		
		vectorSource = new ol.source.Vector({
		features: iconFeatures
		});
		
		vectorLayer = new ol.layer.Vector({
			source: vectorSource,
			style: iconStyle
			});
		map.addLayer(vectorLayer);
	
	};
	
});




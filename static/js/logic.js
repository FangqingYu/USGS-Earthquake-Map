// Store our API endpoint inside queryUrl
var queryUrl = "http://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=2019-02-22&endtime=" +
  "2019-02-23&maxlongitude=-69.52148437&minlongitude=-123.83789062&maxlatitude=48.74894534&minlatitude=25.16517337";



  
// Perform a GET request to the query URL
d3.json(queryUrl, function(data) {
    // Once we get a response, send the data.features object to the createFeatures function
    console.log(data);
    createFeatures(data.features);
});





function createFeatures(earthquakeData) {

    // Define a function we want to run once for each feature in the features array
    // Draw a cirlce at each place where the radius is the magnitude
    function markersToLayer(feature) {
        if (feature.properties.mag > 5) {
            color= "#FF0000"
        }
        else if (feature.properties.mag > 4) {
            color = "#FF4000"
        }
        else if (feature.properties.mag > 3) {
            color = "#FF8000"
        }
        else if (feature.properties.mag > 2) {
            color = "#FFBF00"
        }
        else if (feature.properties.mag > 1) {
            color = "#FFFF00"
        }
        else {
            color = "#BFFF00"
        }


       var MarkerOptions = {
           radius: feature.properties.mag,
           fillColor: color,
           color: color,
           fillOpacity: 0.8,
           weight: 1,
           opacity: 0.8
        };

        console.log(feature.geometry.coordinates.slice(0,2));
        
        return L.circleMarker(feature.geometry.coordinates, MarkerOptions)
        
    }

    // Define a function we want to run once for each feature in the features array
    // Give each feature a popup describing the place and time of the earthquake
    function onEachFeature(feature, layer) {

       layer.bindPopup("<h3>" + feature.properties.place +
       "</h3><hr><p>Magnitude: " + feature.properties.mag + "</p>" +
       "</h3><p>" + new Date(feature.properties.time) + "</p>" );
    }
    
    // Create a GeoJSON layer containing the features array on the earthquakeData object
    // Run the onEachFeature function once for each piece of data in the array
    
    var earthquakes = L.geoJSON(earthquakeData, {
        pointToLayer: markersToLayer,
        onEachFeature: onEachFeature
    });
    

    // Sending our earthquakes layer to the createMap function
    createMap(earthquakes);
}




function createMap(earthquakes) {
    
    var satellite = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 18,
        id: "mapbox.satellite",
        accessToken:  MAP_KEY
    });

    var grayscale = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 18,
        id: "mapbox.light",
        accessToken:  MAP_KEY
    });

    var outdoor = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 18,
        id: "mapbox.streets-basic",
        accessToken:  MAP_KEY
    });

    // Define a baseMaps object to hold our base layers
    // Only one base layer can be shown at a time
    var baseMaps = {
        "Satellite": satellite,
        "Grayscale": grayscale,
        "Outdoor": outdoor
    };
    
    // Create overlay object to hold our overlay layer
    var overlayMaps = {
        Earthquakes: earthquakes
    };

    // Create our map, giving it the streetmap and earthquakes layers to display on load
    var myMap = L.map("map", {
        center: [37.09, -109.71],
        zoom: 5,
        layers: [satellite, earthquakes]
    });

    // Create a layer control
    // Pass in our baseMaps and overlayMaps
    // Add the layer control to the map
    L.control.layers(baseMaps, overlayMaps, {
        collapsed: false
    }).addTo(myMap);

}


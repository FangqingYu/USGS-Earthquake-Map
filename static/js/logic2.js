// Get the past 24 hours
var today = new Date()
var yesterday = new Date(new Date().getTime() - 24 * 60 * 60 * 1000);

console.log(today);
console.log(yesterday);

//January is 0

start_date = `${yesterday.getFullYear()}-${yesterday.getMonth() + 1}-${yesterday.getDate()}`
end_date = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`


console.log(start_date);
console.log(end_date);


// Store our API endpoint inside queryUrl
var queryUrl = "https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=" + start_date + "&endtime=" +
  end_date + "&maxlongitude=-69.52148437&minlongitude=-123.83789062&maxlatitude=48.74894534&minlatitude=25.16517337";


// Perform a GET request to the query URL
d3.json(queryUrl, function(data) {
    // Once we get a response, send the data.features object to the createFeatures function
    console.log(data.features);

    // function that determines marker size
    function markerSize(mag) {
        return mag * 21000;
    }
    
    //function that determines maker color
    function markerColor(mag) {
        if (mag > 5) {
            color= "#FF0000"
        }
        else if (mag > 4) {
            color = "#FF4000"
        }
        else if (mag > 3) {
            color = "#FF8000"
        }
        else if (mag > 2) {
            color = "#FFBF00"
        }
        else if (mag > 1) {
            color = "#FFFF00"
        }
        else {
            color = "#BFFF00"
        }

        return color
    }

    //Define arrays to hold earthquake markers
    earthquakes = [];

    data.features.forEach(feature => {
        // console.log(feature);
        console.log(feature.properties.mag)
        console.log(feature.geometry.coordinates)
        var temp = feature.geometry.coordinates
        var latlng = [temp[1], temp[0], temp[2]]
        earthquakes.push(
            L.circle(latlng, {
                stroke: true,
                fillOpacity: 1,
                color: "#3B170B",
                weight: 0.3,
                fillColor: markerColor(feature.properties.mag),
                radius: markerSize(feature.properties.mag)
            }).bindPopup("<h3>" + feature.properties.place +
            "</h3><hr><p>Magnitude: " + feature.properties.mag + "</p>" +
            "</h3><p>" + new Date(feature.properties.time) + "</p>" )
        );
    });

    console.log(earthquakes);

    //Create layer group for earthquake markers
    var earthquakes_layer = L.layerGroup(earthquakes);

    // Define a baseMaps object to hold our base layers
    // Only one base layer can be shown at a time
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
        "Outdoor": outdoor,
        "Grayscale": grayscale,
        "Satellite": satellite  
    };

    // Create overlay object to hold our overlay layer
    var overlayMaps = {
        "Earthquakes": earthquakes_layer
    };


    // Define a map object, 
    //create our map, giving it the streetmap and earthquakes layers to display on load
    var myMap = L.map("map", {
        center: [37.09, -90.71],
        zoom: 4.3,
        layers: [outdoor, earthquakes_layer]
    });

    // Create a layer control
    // Pass in our baseMaps and overlayMaps
    // Add the layer control to the map
    L.control.layers(baseMaps, overlayMaps, {
        collapsed: false
    }).addTo(myMap);

    // Set up the legend
    var legend = L.control({position: 'bottomright'});
    legend.onAdd = function () {

        var div = L.DomUtil.create('div', 'info legend');
        labels = ['<label class=\'labelHeading\'><strong>Magnitude</strong></label><br><br>'],
        limits = ['0-1','1-2','2-3','3-4','4-5','5+'];
        var colors = ['#BFFF00','#FFFF00', '#FFBF00', '#FF8000', '#FF4000', '#FF0000' ];

        limits.forEach(function(limit, index) {
            
            labels.push("<label class=\"legendColor\" style=\"background-color: " + colors[index] + "\">" + "</label>" +
            "<label class=\"legendLabel\"  >" + limit +  "</label><br><br>");
        
        });
    
        div.innerHTML += labels.join("") ;
        return div;

    };
    legend.addTo(myMap);


});


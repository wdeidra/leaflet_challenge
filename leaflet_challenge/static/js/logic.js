// Create the 'basemap' tile layer that will be the background of our map.
var basemap = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: 'Map data © <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  maxZoom: 18
});

// OPTIONAL: Step 2
// Create the 'street' tile layer as a second background of the map
var streetmap = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: 'Map data © <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  maxZoom: 18
});

// Create the map object with center and zoom options.
var map = L.map("map", {
  center: [37.7749, -122.4194], 
  zoom: 5,
  layers: [basemap]
});

// Then add the 'basemap' tile layer to the map.
basemap.addTo(map);
  
// OPTIONAL: Step 2
// Create the layer groups, base maps, and overlays for our two sets of data, earthquakes and tectonic_plates.
// var overlayMaps = {
//   "Earthquakes": earthquakes,
//   "Tectonic Plates": tectonicPlates
// };
// // Add a control to the map that will allow the user to change which layers are visible.
// L.control.layers(baseMaps, overlayMaps).addTo(map);

// Make a request that retrieves the earthquake geoJSON data.
d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson").then(function (data) {

  // This function returns the style data for each of the earthquakes we plot on
  // the map. Pass the magnitude and depth of the earthquake into two separate functions
  // to calculate the color and radius.
  function styleInfo(feature) {
    return {
      opacity: 1,
      fillOpacity: 1,
      fillColor: getColor(feature.geometry.coordinates[2]),
      color: "#000000",
      radius: getRadius(feature.properties.mag),
      stroke: true,
      weight: 0.5
    };
  }
  

  // This function determines the color of the marker based on the depth of the earthquake.
  function getColor(depth) {
    return depth > 90 ? "#ea2c2c" :
           depth > 70 ? "#ea822c" :
           depth > 50 ? "#ee9c00" :
           depth > 30 ? "#eecc00" :
           depth > 10 ? "#d4ee00" :
                        "#98ee00";
  }

  // This function determines the radius of the earthquake marker based on its magnitude.
  function getRadius(magnitude) {
    return magnitude * 4;

  }

  // Add a GeoJSON layer to the map once the file is loaded.
  L.geoJson(data, {
    // Turn each feature into a circleMarker on the map.
    pointToLayer: function (feature, latlng) {
      return L.circleMarker(latlng);
    },
    // Set the style for each circleMarker using our styleInfo function.
    style: styleInfo,
    // Create a popup for each marker to display the magnitude and location of the earthquake after the marker has been created and styled
    onEachFeature: function (feature, layer) {
      layer.bindPopup('Magnitude: ${feature.properties.mag}<br>Depth: ${feature.geometry.coordinates[2]} km'); 
    
  // OPTIONAL: Step 2
  // Add the data to the earthquake layer instead of directly to the map.
  //}).addTo(map);
// Add a mouseover event to display the magnitude and depth
  layer.on('mouseover', function (e) {
    var popupContent = `Magnitude: ${feature.properties.mag}<br>Depth: ${feature.geometry.coordinates[2]} km`;
    layer.bindTooltip(popupContent).openTooltip(e.latlng);
  });

  // Add a mouseout event to close the tooltip
  layer.on('mouseout', function () {
    layer.closeTooltip();
  });
}
}).addTo(map);

  // Create a legend control object.
  let legend = L.control({
    position: "bottomright"
  });

  // Then add all the details for the legend
  legend.onAdd = function () {
    let div = L.DomUtil.create("div", "info legend");
    
    // Initialize depth intervals and colors for the legend
    const depthLevels = [0, 10, 30, 50, 70, 90];
    const colors = ["#98ee00", "#d4ee00", "#eecc00", "#ee9c00", "#ea822c", "#ea2c2c"];

    // Loop through our depth intervals to generate a label with a colored square for each interval.
    for (let i = 0; i < depthLevels.length; i++) {
      div.innerHTML +=
        "<i style='background: " + colors[i] + "'></i> " +
        depthLevels[i] + (depthLevels[i + 1] ? "&ndash;" + depthLevels[i + 1] + "<br>" : "+");
    }
    return div;
  
  };
  // Add the legend to the map.
  legend.addTo(map);

  // OPTIONAL: Step 2
  // Make a request to get our Tectonic Plate geoJSON data.
  // d3.json("https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json").then(function (plate_data) {
  //   // Save the geoJSON data, along with style information, to the tectonic_plates layer.
  //   L.geoJson(plate_data, {
  //     color: "orange",
  //     weight: 2
  //   }).addTo(tectonicPlates);

  //   // Then add the tectonic_plates layer to the map.
  //   tectonicPlates.addTo(map);
  // });
});

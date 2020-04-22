var myMap = L.map("map", {
    center: [10, -20],
    zoom: 3
  });

  var legend = L.control({
    position: 'bottomleft'
  });
  
  // Adding a tile layer (the background map image) to our map
  // We use the addTo method to add objects to our map
  L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.streets",
    accessToken: API_KEY
  }).addTo(myMap);

  d3.json('https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson', data => {

    data.features.forEach(loc => {
        var lng = loc.geometry.coordinates[0];
        var lat = loc.geometry.coordinates[1];
        var mag = loc.properties.mag;
        var place = loc.properties.place;

        L.circle([lat,lng], {
            stroke: true,
            fillOpacity: 1,
            color:  'brown',
            fillColor: getColor(mag),
            radius: mag * 30000
        }).bindPopup(`<h2>${place}</h2><h2>Magnitude: ${mag}</h2>`).addTo(myMap);
    });
  });

  function getColor(magnitude) {
    magnitude < 1 ? magnitude = 1 : magnitude;

    return  magnitude > 5 ? '#ea2c2c' : 
            magnitude > 4 ? '#ea822c' :        
            magnitude > 3 ? '#ee9c00' :        
            magnitude > 2 ? '#eecc00' :        
            magnitude > 1 ? '#d4ee00' :
                            '#98ee00';       
}

legend.onAdd = function () {
  var div = L.DomUtil.create('div','info legend');
  

  var grades = [0,1,2,3,4,5];
  var colors = ['#98ee00','#d4ee00', '#eecc00','#ee9c00', '#ea822c','#ea2c2c'];
  
  // div.innerHTML +=
  // var str = '';

  for (let i = 0; i < grades.length; i++) {

    div.innerHTML += '<i style="background: ' + colors[i] + '">' +
      grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] +
      '<br>' : '+');
  };

  div.innerHTML += `
    <style>
      .legend {
        background: black;
        border: 2px solid white;
        border-radius: 12px;
        padding: 10px;
        box-shadow: 5px 5px 5px black;
      }
    </style>`
  // div.innerHTML = d3
  // .append('div')
  // .style('background', 'white')
  // .style('border', '2px solid black')
  // .html(str)

  return div;
};

legend.addTo(myMap);
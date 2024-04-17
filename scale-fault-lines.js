import fs from 'fs';


// Read the geojson file

const geojsonData = fs.readFileSync('ca_fault_lines.geojson', 'utf8');


// Parse the data as JSON

const geojson = JSON.parse(geojsonData);


// Divide each coordinate in the file by 100000

geojson.features = geojson.features.map(feature => {
  feature["ShapeSTAre"] /= 100000;
  feature["ShapeSTLen"] /= 100000;
  feature.geometry.coordinates = feature.geometry.coordinates.map(coord => {
    return coord.map(c => {
      return c.map(b => {
        console.log(b, b / 100000)
        return b / 100000
      })
    })
 
  });

  return feature

});


// Write the modified data to a new file

fs.writeFileSync('ca_fault_lines_scaled.geojson', JSON.stringify(geojson));
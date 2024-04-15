export function describeGeoJSON(geoJSON){
  const geometryTypes = new Set();
  const propertyRanges = {};

  // Loop through the features
  geoJSON.features.forEach((feature) => {
    // Record the geometry type
    if (feature.geometry && feature.geometry.type) {
      geometryTypes.add(feature.geometry.type);
    }

    // Loop through the properties and record the ranges
    if (feature.properties) {
      Object.keys(feature.properties).forEach(key => {
        const value = feature.properties[key];
        if (typeof value === 'number') {
          if (!propertyRanges[key]) {
            propertyRanges[key] = { min: value, max: value };
          } else {
            if (value < propertyRanges[key].min) propertyRanges[key].min = value;
            if (value > propertyRanges[key].max) propertyRanges[key].max = value;
          }
        }
      });
    }
  });

  return { propertyRanges, geometryTypes }
}


function checkString(string) {
    return /^[0-9]*$/.test(string);
}

export function generateLayerStyle(geoJSONAnalysis, style) {
  console.log(geoJSONAnalysis, style);
  const { propertyRanges, geometryTypes } = geoJSONAnalysis;
  const layerStyles = [];

  geometryTypes.forEach((type) => {
    let layerStyle = {
      id: `${type}-layer`,
      type: getLayerType(type),
      source: 'geojson-data',
      paint: {},
    };

    if(checkString(style.scale)){
      console.log("Scale is number");
      style.scale = style.scale * 1;
    } else {
      style.scale = [

      "interpolate",

      ["linear"],

      ["get", style.scale],

      0, 5,

      10, 50

      ]
    }

    // Define paint properties based on geometry type
    switch (type) {
      case 'Point':
      case 'MultiPoint':
        layerStyle.paint = {
          'circle-radius': style.scale, // Default, could be dynamic based on a property
          'circle-color': style.color, // Default, could be dynamic based on a property
          'circle-opacity': style.opacity * 1,
        };
        break;
      case 'LineString':
      case 'MultiLineString':
        layerStyle.paint = {
          'line-width': 2, // Default, could be dynamic based on a property
          'line-color': style.color, // Default, could be dynamic based on a property
          'line-opacity': style.opacity * 1
        };
        break;
      case 'Polygon':
      case 'MultiPolygon':
        layerStyle.paint = {
          'fill-color': style.color, // Default, could be dynamic based on a property
          'fill-opacity': style.opacity * 1,
        };
        break;
      // Add other cases as needed
    }

    layerStyles.push(layerStyle);
  });

  return layerStyles;
}

function getLayerType(geometryType) {
  switch (geometryType) {
    case 'Point':
    case 'MultiPoint':
      return 'circle';
    case 'LineString':
    case 'MultiLineString':
      return 'line';
    case 'Polygon':
    case 'MultiPolygon':
      return 'fill';
    // Add other cases as needed
    default:
      return 'circle'; // Default layer type
  }
}
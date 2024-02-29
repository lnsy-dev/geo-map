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



export function generateLayerStyle(geoJSONAnalysis) {
  const { propertyRanges, geometryTypes } = geoJSONAnalysis;
  const layerStyles = [];

  geometryTypes.forEach((type) => {
    let layerStyle = {
      id: `${type}-layer`,
      type: getLayerType(type),
      source: 'geojson-data',
      paint: {},
    };

    // Define paint properties based on geometry type
    switch (type) {
      case 'Point':
      case 'MultiPoint':
        layerStyle.paint = {
          'circle-radius': 5, // Default, could be dynamic based on a property
          'circle-color': '#007cbf', // Default, could be dynamic based on a property
          'circle-opacity': 0.8,
        };
        break;
      case 'LineString':
      case 'MultiLineString':
        layerStyle.paint = {
          'line-width': 2, // Default, could be dynamic based on a property
          'line-color': '#007cbf', // Default, could be dynamic based on a property
        };
        break;
      case 'Polygon':
      case 'MultiPolygon':
        layerStyle.paint = {
          'fill-color': '#007cbf', // Default, could be dynamic based on a property
          'fill-opacity': 0.5,
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
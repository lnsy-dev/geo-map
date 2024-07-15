


class GeoJSON extends HTMLElement {
  connectedCallback(){
    this.attrs = this.getAttributeNames().reduce((acc, name) => {
      return {...acc, [name]: this.getAttribute(name)};
    }, {});

    const required_attributes = ['src'];
    this.observedAttributes = required_attributes;
    required_attributes.forEach(attribute => {
      if(typeof this.attrs[attribute] === 'undefined'){
        return console.error(`The attribute ${attribute} is required;`)
      }
    });
    if(this.attrs.scale === null){
      this.attrs.scale = 1;
    }
    if(this.attrs.color === null){
      this.attrs.color = "#F00";
    }
    if(this.attrs.opacity === null){
      this.attrs.opacity = 1
    }
    if(this.attrs.id === null){
      this.attrs.id = crypto.randomUUID()
    }

    this.template = this.querySelector('template');
  }

}

customElements.define('geo-json', GeoJSON)

export function describeGeoJSON(geoJSON){
  const geometryTypes = new Set();
  const propertyRanges = {};

  console.log('DATA LOOKS LIKE:', geoJSON.features[0]);
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

export function generateLayerStyle(geoJSONAnalysis, style, layerID) {
  const { propertyRanges, geometryTypes } = geoJSONAnalysis;
  const layerStyles = [];


  geometryTypes.forEach((type, index) => {
    let layerStyle = {
      id: `${layerID}-layer-${index}`,
      source: layerID,
      paint: {},
    };

    if(checkString(style.scale)){
      style.scale = style.scale * 1;
    } else {
      style.scale = [
        "interpolate",
        ["linear"],
        ["get", style.scale],
        propertyRanges[style.scale].min, propertyRanges[style.scale].max,
        1, 10
      ]
    }

    // Define paint properties based on geometry type
    switch (type) {
      case 'Point':
      case 'MultiPoint':
        layerStyle.type = 'circle';
        layerStyle.paint = {
          'circle-radius': style.scale, // Default, could be dynamic based on a property
          'circle-color': style.color, // Default, could be dynamic based on a property
          'circle-opacity': style.opacity * 1,
        };
        break;
      case 'LineString':
      case 'MultiLineString':
        layerStyle.type = 'line';
        layerStyle.paint = {
          'line-width': 2, // Default, could be dynamic based on a property
          'line-color': style.color, // Default, could be dynamic based on a property
          'line-opacity': style.opacity * 1
        };
        break;
      case 'Polygon':
      case 'MultiPolygon':
        layerStyle.type = 'fill';
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

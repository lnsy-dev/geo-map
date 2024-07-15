import 'https://api.mapbox.com/mapbox-gl-js/plugins/mapbox-gl-geocoder/v4.7.0/mapbox-gl-geocoder.min.js';


function initializeGeoCoder(map, bbox = []){
    if(bbox !== null){
      bbox = bbox.split(',').map(d => {
        return Number(d.trim());
      });
    }
    const geocoder = new MapboxGeocoder({
      accessToken: mapboxgl.accessToken,
      mapboxgl: mapboxgl,
      zoom: 18,
      marker: false,
      bbox:bbox,
      placeholder: 'Search for an Address'
    })
    map.addControl( geocoder )
}

export default initializeGeoCoder;

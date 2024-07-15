function initializeGeoLocate(map){
  const geolocate = new mapboxgl.GeolocateControl({
    showAccuracy: false,
    showUserLocation: false
  });
  map.addControl(geolocate);
}

export default initializeGeoLocate;
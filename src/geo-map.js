import 'https://api.mapbox.com/mapbox-gl-js/v2.9.2/mapbox-gl.js';
import 'https://api.mapbox.com/mapbox-gl-js/plugins/mapbox-gl-geocoder/v4.7.0/mapbox-gl-geocoder.min.js';

import { getURLValues, ready } from './helpers.js';

class GeoMapComponent extends HTMLElement {
  constructor() {
    super();
    if(typeof(mapboxgl) === 'undefined'){
      return console.error('Geo Map component requires Mapbox to work');
    }
    const URLvalues = getURLValues();

    this.access_token = this.getAttribute('accesstoken');
    if(this.access_token === null){
      return console.error('Geo Map component requires a MapBox access token');
    }
    this.removeAttribute('accesstoken');
    mapboxgl.accessToken = this.access_token;

    this.styleurl = this.getAttribute('styleurl');
    if(this.styleurl === null || this.styleurl === ""){
      console.warn('could not find style url, using the default');
      this.styleurl = 'mapbox://styles/mapbox/streets-v11';
    }
    this.removeAttribute('styleurl');

    this.latitude = this.getAttribute('latitude');
    if(this.latitude === null) this.latitude = 0;
    this.latitude = URLvalues.latitude ? URLvalues.latitude : this.latitude;

    this.longitude = this.getAttribute('longitude');
    if(this.longitude === null) this.longitude = 0;
    this.longitude = URLvalues.longitude ? URLvalues.longitude : this.longitude;

    this.zoom = this.getAttribute('zoom');
    if(this.zoom === null) this.zoom = 1;
    this.zoom = URLvalues.zoom ? URLvalues.zoom : this.zoom;

    this.bearing = this.getAttribute('bearing');
    if(this.bearing === null) this.bearing = 0;
    this.bearing = URLvalues.bearing ? URLvalues.bearing : this.bearing;

    this.pitch = this.getAttribute('pitch');
    if(this.pitch === null) this.pitch = 0;
    this.pitch = URLvalues.pitch ? URLvalues.pitch : this.pitch;

    this.locked = this.getAttribute('locked');
    if(this.locked === null){
      this.locked = false;
    } else {
      this.locked = true;
    };

    this.navigation_control = this.getAttribute('navigation-control');
    if(this.navigation_control === null) this.navigation_control = false;

    this.slideshow = this.getAttribute('slideshow');
  }

  showLayer(layer_id){  
    const visibility = this.map.getLayoutProperty(layer_id, 'visibility');
    if (typeof visibility !== 'undefined') {
      if (visibility === 'none') {
        this.map.setLayoutProperty(layer_id, 'visibility', 'visible');
      }
    }
  }

  hideLayer(layer_id){
    var visibility = this.map.getLayoutProperty(layer_id, 'visibility');
    if (typeof visibility !== 'undefined') {
      if (visibility !== 'none') {
        this.map.setLayoutProperty(layer_id, 'visibility', 'none');
      }
    }
  }

  getLayer(layer_id){
    // Get the layer by ID
    const layer = this.map.getLayer(layer_id);

    // Check if the layer exists
    if (layer) {
      return layer;
    } else {
      return console.error('Layer not found.');
    }
  }
  getLayers(){
 
    // These Layers are Default.
    const default_layers = [
      "background",
      "satellite",
      "tunnel-minor-case",
      "tunnel-street-case",
      "tunnel-minor-link-case",
      "tunnel-secondary-tertiary-case",
      "tunnel-primary-case",
      "tunnel-major-link-case",
      "tunnel-motorway-trunk-case",
      "tunnel-path",
      "tunnel-steps",
      "tunnel-pedestrian",
      "tunnel-minor",
      "tunnel-minor-link",
      "tunnel-major-link",
      "tunnel-street",
      "tunnel-street-low",
      "tunnel-secondary-tertiary",
      "tunnel-primary",
      "tunnel-motorway-trunk",
      "road-path",
      "road-steps",
      "road-pedestrian",
      "road-minor-case",
      "road-street-case",
      "road-minor-link-case",
      "road-secondary-tertiary-case",
      "road-primary-case",
      "road-major-link-case",
      "road-motorway-trunk-case",
      "road-minor",
      "road-minor-link",
      "road-major-link",
      "road-street",
      "road-street-low",
      "road-secondary-tertiary",
      "road-primary",
      "road-motorway-trunk",
      "bridge-path",
      "bridge-steps",
      "bridge-pedestrian",
      "bridge-minor-case",
      "bridge-street-case",
      "bridge-minor-link-case",
      "bridge-secondary-tertiary-case",
      "bridge-primary-case",
      "bridge-major-link-case",
      "bridge-motorway-trunk-case",
      "bridge-minor",
      "bridge-minor-link",
      "bridge-major-link",
      "bridge-street",
      "bridge-street-low",
      "bridge-secondary-tertiary",
      "bridge-primary",
      "bridge-motorway-trunk",
      "bridge-major-link-2-case",
      "bridge-motorway-trunk-2-case",
      "bridge-major-link-2",
      "bridge-motorway-trunk-2",
      "aerialway",
      "admin-1-boundary-bg",
      "admin-0-boundary-bg",
      "admin-1-boundary",
      "admin-0-boundary",
      "admin-0-boundary-disputed",
      "road-label",
      "road-intersection",
      "road-number-shield",
      "road-exit-shield",
      "path-pedestrian-label",
      "ferry-aerialway-label",
      "waterway-label",
      "natural-line-label",
      "natural-point-label",
      "water-line-label",
      "water-point-label",
      "poi-label",
      "transit-label",
      "airport-label",
      "settlement-subdivision-label",
      "settlement-minor-label",
      "settlement-major-label",
      "state-label",
      "country-label",
      "continent-label"
    ]

    const layers = this.map.getStyle().layers;
    let unique_layers = []

    // Iterate over the layers and print their IDs
    layers.forEach(function(layer) {
      if(default_layers.indexOf(layer.id) < 0){
        unique_layers.push(unique_layers);
      }
    });

    return unique_layers;
  }

  getGeoJSON(geoJsonUrl, property){
    fetch(geoJsonUrl)
    .then(function(response) {
      return response.json();
    })
    .then((data) => {

      console.log(data)
      // Add the GeoJSON layer to the map
      this.map.addSource('geojson-data', {
        type: 'geojson',
        data: data
      });

      // Add a layer to visualize the GeoJSON data
      this.map.addLayer({
        id: 'geojson-layer',
        type: 'circle',
        source: 'geojson-data',
        paint: {
          'circle-radius': {
            property: property,
            type: 'exponential',
            stops: [
              [0, 2],
              [10, 20]
            ]
          },
          'circle-color': '#f00',
          'circle-opacity': 0.5
        }
      });

      this.showLayer('geojson-layer');
    })
    .catch(function(error) {
      console.log('Error fetching GeoJSON:', error);
    });
  }

  connectedCallback() {
    ready(() => this.initialize())
  }

  async initialize(){
    const el = document.createElement('map-container')
    this.appendChild(el)
    this.map = await new mapboxgl.Map({
      container: el, // container ID
      style: this.styleurl, // style URL
      center: [this.longitude, this.latitude],
      zoom: this.zoom,
      bearing: this.bearing,
      projection: 'globe',
      pitch: this.pitch,
      interactive: !this.locked
    })

    this.initialized = true;
    this.map.on('load', () => {this.mapLoaded()})
  }

  initializeGeoCoder(){
    let bbox = this.getAttribute('search-bounds');
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

    this.map.addControl( geocoder )
   
  }

  initializeGeoLocate(){
    const geolocate = new mapboxgl.GeolocateControl({
      showAccuracy: false,
      showUserLocation: false
    });

    this.map.addControl(geolocate);
  }

  initializeNavigationControl(){
    const nav_control = new mapboxgl.NavigationControl({
      visualizePitch: true
    })
    this.map.addControl(nav_control);
  }

  handleMoveEnd(e){
    let coords = this.map.getCenter();
    const bounds = this.map.getBounds();
    const zoom = this.map.getZoom();
    this.handleZoom(zoom);
    this.dispatchEvent(
      new CustomEvent('MAP MOVED', 
        {
          detail: {
            coords,
            bounds,
            zoom
          }
        }
      )
    );
  }

  handleZoom(zoom = 0){
    let mid_zoom_breakpoint = 15;
    let far_zoom_breakpoint = 10; 
    const zoom_breakpoints = this.getAttribute('zoom-breakpoints');
    if(zoom_breakpoints !== null){
      [mid_zoom_breakpoint, far_zoom_breakpoint] = zoom_breakpoints.split(',').map(n => Number(n));
    }
    if(zoom < far_zoom_breakpoint){
        this.classList.add('far');
        this.classList.remove('middle');
        this.classList.remove('near');
    } else if(zoom >= far_zoom_breakpoint && zoom <= mid_zoom_breakpoint){
        this.classList.add('middle')
        this.classList.remove('far')
        this.classList.remove('near')
    } else {
        this.classList.add('near')
        this.classList.remove('middle')
        this.classList.remove('far')
    }
  }

  showPopup(content){
    const popup = new mapboxgl.Popup({ 
      closeOnClick: false, 
      closeOnMove: true,
       offset: {
            'bottom': [-60, -10]
          },
    })
    .setLngLat(geo_map.map.getCenter())
    .setHTML(content)
    .addTo(this.map)
  }

  mapLoaded(){

    if(this.geocoder !== null){   
      if(typeof(MapboxGeocoder) === 'undefined'){
        this.innerHTML = `If you would like to use the geocoder element, 
        you must include the geocoder plugin in your HTML: 
        https://docs.mapbox.com/mapbox-gl-js/example/mapbox-gl-geocoder/`
        return
      } 

      this.initializeGeoCoder();
    }

    this.geolocate_attribute = this.getAttribute('geolocate')
    if(this.geolocate_attribute !== null){
      this.initializeGeoLocate();
    }

    if(this.navigation_control){
      this.initializeNavigationControl();
    }

    this.map.on('moveend', (e) => {
      this.handleMoveEnd(e)
    });

    this.map.on('click', (e) => {
      this.map.flyTo({center:e.lngLat, zoom:18.5});
      [...document.querySelectorAll('geo-map-modal')].forEach( modal => {
        modal.hideModal();
      })
    });

    const geo_json_component = this.querySelector('geo-json');
    if(geo_json_component !== null){
      const src = geo_json_component.getAttribute('src');
      const variable = geo_json_component.getAttribute('variable');
      this.getGeoJSON(src, variable);
    }



    this.style.opacity = 1;
    this.handleZoom(this.zoom);

    /*
    // This emits an even when the map is loaded. 
    // you can attach a function to this like
    //  geo_map.addEventListener('loaded', () => {
    //    your function here
    //  });
    */

    this.dispatchEvent(new Event('loaded'))
  }
}

customElements.define('geo-map', GeoMapComponent)


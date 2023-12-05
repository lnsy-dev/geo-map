// Importing Mapbox and its geocoder plugin
import 'https://api.mapbox.com/mapbox-gl-js/v2.9.2/mapbox-gl.js';
import 'https://api.mapbox.com/mapbox-gl-js/plugins/mapbox-gl-geocoder/v4.7.0/mapbox-gl-geocoder.min.js';

// Importing helper functions
import { getURLValues, ready } from './helpers.js';

// Defining a custom web component for the GeoMap
class GeoMapComponent extends HTMLElement {
  constructor() {
    super();

    // Checking if Mapbox is available
    if (typeof mapboxgl === 'undefined') {
      return console.error('Geo Map component requires Mapbox to work');
    }

    // Getting Mapbox access token from the attribute
    this.access_token = this.getAttribute('accesstoken');
    if (this.access_token === null) {
      return console.error('Geo Map component requires a MapBox access token');
    }
    this.removeAttribute('accesstoken');
    mapboxgl.accessToken = this.access_token;

    // Getting and setting various attributes for map configuration
    this.styleurl = this.getAttribute('styleurl') || 'mapbox://styles/mapbox/streets-v11';
    this.removeAttribute('styleurl');

    this.latitude = this.getAttribute('latitude') || 0;
    this.latitude = getURLValues().latitude || this.latitude;

    this.longitude = this.getAttribute('longitude') || 0;
    this.longitude = getURLValues().longitude || this.longitude;

    this.zoom = this.getAttribute('zoom') || 1;
    this.zoom = getURLValues().zoom || this.zoom;

    this.bearing = this.getAttribute('bearing') || 0;
    this.bearing = getURLValues().bearing || this.bearing;

    this.pitch = this.getAttribute('pitch') || 0;
    this.pitch = getURLValues().pitch || this.pitch;

    this.locked = this.getAttribute('locked') !== null;
    this.slideshow = this.getAttribute('slideshow');
  }

  // Placeholder functions for future implementation
  showLayer() {
    return console.error('FEATURE NOT IMPLEMENTED');
  }

  hideLayer() {
    return console.error('FEATURE NOT IMPLEMENTED');
  }

  getLayers() {
    return console.error('FEATURE NOT IMPLEMENTED');
  }

  // Called when the component is added to the DOM
  connectedCallback() {
    ready(() => this.initialize());
  }

  // Initializes the map
  async initialize() {
    const el = document.createElement('map-container');
    this.appendChild(el);

    this.map = await new mapboxgl.Map({
      container: el,
      style: this.styleurl,
      center: [this.longitude, this.latitude],
      zoom: this.zoom,
      bearing: this.bearing,
      projection: 'globe',
      pitch: this.pitch,
      interactive: !this.locked,
    });

    this.initialized = true;
    this.map.on('load', () => {
      this.mapLoaded();
    });
  }

  // Initializes Mapbox geocoder if specified
  initializeGeoCoder() {
    let bbox = this.getAttribute('search-bounds');
    if (bbox !== null) {
      bbox = bbox.split(',').map(d => Number(d.trim()));
    }

    const geocoder = new MapboxGeocoder({
      accessToken: mapboxgl.accessToken,
      mapboxgl: mapboxgl,
      zoom: 18,
      marker: false,
      bbox: bbox,
      placeholder: 'Search for an Address',
    });

    this.map.addControl(geocoder);
  }

  // Initializes Mapbox geolocation control if specified
  initializeGeoLocate() {
    const geolocate = new mapboxgl.GeolocateControl({
      showAccuracy: false,
      showUserLocation: false,
    });

    this.map.addControl(geolocate);
  }

  // Handles the end of map movement
  handleMoveEnd(e) {
    let coords = this.map.getCenter();
    const bounds = this.map.getBounds();
    const zoom = this.map.getZoom();
    this.handleZoom(zoom);

    // Dispatches an event with map details
    this.dispatchEvent(
      new CustomEvent('MAP MOVED', {
        detail: {
          coords,
          bounds,
          zoom,
        },
      })
    );
  }

  // Handles zoom level and updates CSS classes accordingly
  handleZoom(zoom = 0) {
    let mid_zoom_breakpoint = 15;
    let far_zoom_breakpoint = 10;
    const zoom_breakpoints = this.getAttribute('zoom-breakpoints');
    if (zoom_breakpoints !== null) {
      [mid_zoom_breakpoint, far_zoom_breakpoint] = zoom_breakpoints.split(',').map(n => Number(n));
    }
    if (zoom < far_zoom_breakpoint) {
      this.classList.add('far');
      this.classList.remove('middle');
      this.classList.remove('near');
    } else if (zoom >= far_zoom_breakpoint && zoom <= mid_zoom_breakpoint) {
      this.classList.add('middle');
      this.classList.remove('far');
      this.classList.remove('near');
    } else {
      this.classList.add('near');
      this.classList.remove('middle');
      this.classList.remove('far');
    }
  }

  // Displays a popup on the map
  showPopup(content) {
    const popup = new mapboxgl.Popup({
      closeOnClick: false,
      closeOnMove: true,
      offset: {
        'bottom': [-60, -10],
      },
    })
      .setLngLat(geo_map.map.getCenter())
      .setHTML(content)
      .addTo(this.map);
  }

  // Called when the map has finished loading
  mapLoaded() {
    // Checking and initializing Mapbox geocoder
    if (this.geocoder !== null) {
      if (typeof MapboxGeocoder === 'undefined') {
        this.innerHTML = `If you would like to use the geocoder element, 
        you must include the geocoder plugin in your HTML: 
        https://docs.mapbox.com/mapbox-gl-js/example/mapbox-gl-geocoder/`;
        return;
      }

      this.initializeGeoCoder();
    }

    // Initializing Mapbox geolocation control
    this.geolocate_attribute = this.getAttribute('geolocate');
    if (this.geolocate_attribute !== null) {
      this.initializeGeoLocate();
    }

    // Event listeners for map interactions
    this.map.on('moveend', (e) => {
      this.handleMoveEnd(e);
    });

    this.map.on('click', (e) => {
      this.map.flyTo({ center: e.lngLat, zoom: 18.5 });
      [...document.querySelectorAll('geo-map-modal')].forEach((modal) => {
        modal.hideModal();
      });
    });

    this.style.opacity = 1;
    this.handleZoom(this.zoom);

    // Dispatching a 'loaded' event
    this.dispatchEvent(new Event('loaded'));
  }
}

// Registering the custom element
customElements.define('geo-map', GeoMapComponent);

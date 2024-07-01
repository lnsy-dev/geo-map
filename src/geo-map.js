import 'https://api.mapbox.com/mapbox-gl-js/v3.4.0/mapbox-gl.js';
import 'https://api.mapbox.com/mapbox-gl-js/plugins/mapbox-gl-geocoder/v4.7.0/mapbox-gl-geocoder.min.js';
import { populateTemplate, getURLValues, ready } from './helpers.js';
import { describeGeoJSON, generateLayerStyle } from "./geo-json-component.js";
import "./pin.js";
import "./sidebar.js";
import SlideShowControls from './slideshow.js';

/**
 * Custom HTML element extending HTMLElement to integrate Mapbox maps.
 */

class GeoMapComponent extends HTMLElement {

  /**
   * Invoked each time the custom element is appended into a document-connected element.
   */
  connectedCallback() {
    ready(() => this.initialize());
    setTimeout(() => {
      if (!this.initialized) {
        this.initialize();
      }
    }, 3333);
  }

  /**
   * Initializes the map component.
   */
  async initialize() {
    if (typeof mapboxgl === 'undefined') {
      return console.error('Geo Map component requires Mapbox to work');
    }
    const URLvalues = getURLValues();
    this.access_token = this.getAttribute('accesstoken');
    if (this.access_token === null) {
      return console.error('Geo Map component requires a MapBox access token');
    }
    this.removeAttribute('accesstoken');
    mapboxgl.accessToken = this.access_token;
    this.style = getComputedStyle(this);
    this.styleurl = this.getAttribute('styleurl');
    if (this.styleurl === null || this.styleurl === "") {
      console.warn('could not find style url, using the default');
      this.styleurl = 'mapbox://styles/mapbox/streets-v11';
    }
    this.removeAttribute('styleurl');
    this.latitude = this.getAttribute('latitude');
    if (this.latitude === null) this.latitude = 0;
    this.latitude = URLvalues.latitude ? URLvalues.latitude : this.latitude;
    this.longitude = this.getAttribute('longitude');
    if (this.longitude === null) this.longitude = 0;
    this.longitude = URLvalues.longitude ? URLvalues.longitude : this.longitude;
    this.zoom = this.getAttribute('zoom');
    if (this.zoom === null) this.zoom = 1;
    this.zoom = URLvalues.zoom ? URLvalues.zoom : this.zoom;
    this.bearing = this.getAttribute('bearing');
    if (this.bearing === null) this.bearing = 0;
    this.bearing = URLvalues.bearing ? URLvalues.bearing : this.bearing;
    this.pitch = this.getAttribute('pitch');
    if (this.pitch === null) this.pitch = 0;
    this.pitch = URLvalues.pitch ? URLvalues.pitch : this.pitch;
    this.locked = this.getAttribute('locked');
    if (this.locked === null) {
      this.locked = false;
    } else {
      this.locked = true;
    };
    this.navigation_control = this.getAttribute('navigation-control');
    if (this.navigation_control === null) this.navigation_control = false;
    const el = document.createElement('map-container');
    this.appendChild(el);
    this.map = await new mapboxgl.Map({
      container: el, // container ID
      style: this.styleurl, // style URL
      center: [this.longitude, this.latitude],
      zoom: this.zoom,
      bearing: this.bearing,
      projection: 'globe',
      pitch: this.pitch,
      interactive: !this.locked
    });
    this.initialized = true;
    this.map.on('load', () => { this.mapLoaded() });
  }

  /**
   * Initializes the Geocoder control.
   */
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
      placeholder: 'Search for an Address'
    });
    this.map.addControl(geocoder);
  }

  /**
   * Initializes the Geolocate control.
   */
  initializeGeoLocate() {
    const geolocate = new mapboxgl.GeolocateControl({
      showAccuracy: false,
      showUserLocation: false
    });
    this.map.addControl(geolocate);
  }

  /**
   * Initializes the Navigation control.
   */
  initializeNavigationControl() {
    const nav_control = new mapboxgl.NavigationControl({
      visualizePitch: true
    });
    this.map.addControl(nav_control);
  }

  /**
   * Handles the map 'moveend' event.
   * @param {Event} e - The event object.
   */
  handleMoveEnd(e) {
    let coords = this.map.getCenter();
    const bounds = this.map.getBounds();
    const zoom = this.map.getZoom();
    this.setAttribute('latitude', coords.lat);
    this.setAttribute('longitude', coords.lng);
    this.setAttribute('zoom', zoom);
    this.handleZoom(zoom);
    this.dispatchEvent(
      new CustomEvent('MAP MOVED', {
        detail: {
          coords,
          bounds,
          zoom
        }
      })
    );
  }

  /**
   * Handles zoom level changes.
   * @param {number} [zoom=0] - The zoom level.
   */
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

  /**
   * Shows a popup on the map.
   * @param {string} content - The HTML content of the popup.
   * @param {Array<number>} coordinates - The coordinates [longitude, latitude] where the popup will be shown.
   */
  showPopup(content, coordinates) {
    const popup = new mapboxgl.Popup({
      closeOnClick: true,
      closeOnMove: false,
    })
      .setLngLat(coordinates)
      .setHTML(content)
      .addTo(this.map);
  }

  /**
   * Event handler called when the map has loaded.
   */
  mapLoaded() {
    this.geocoder = this.getAttribute('geocoder');
    if (this.geocoder !== null) {
      if (typeof MapboxGeocoder === 'undefined') {
        this.innerHTML = `If you would like to use the geocoder element, 
        you must include the geocoder plugin in your HTML: 
        https://docs.mapbox.com/mapbox-gl-js/example/mapbox-gl-geocoder/`;
        return;
      }
      this.initializeGeoCoder();
    }
    this.geolocate_attribute = this.getAttribute('geolocate');
    if (this.geolocate_attribute !== null) {
      this.initializeGeoLocate();
    }
    if (this.navigation_control) {
      this.initializeNavigationControl();
    }
    this.slideshow = this.getAttribute('slideshow');
    if (this.slideshow !== null) {
      this.map.addControl(new SlideShowControls(this.map, this.geo_map));
    }
    this.map.on('moveend', (e) => {
      this.handleMoveEnd(e);
    });
    const geo_json_components = this.querySelectorAll('geo-json');
    [...geo_json_components].forEach((geo_json_component) => {
      this.getGeoJSON(geo_json_component);
    });
    this.style.opacity = 1;
    this.handleZoom(this.zoom);
    this.dispatchEvent(new CustomEvent('GEO MAP LOADED'));
  }

  /**
   * Shows a map layer.
   * @param {string} layer_id - The ID of the layer to show.
   */
  showLayer(layer_id) {
    const visibility = this.map.getLayoutProperty(layer_id, 'visibility');
    if (typeof visibility !== 'undefined') {
      if (visibility === 'none') {
        this.map.setLayoutProperty(layer_id, 'visibility', 'visible');
      }
    }
  }

  /**
   * Hides a map layer.
   * @param {string} layer_id - The ID of the layer to hide.
   */
  hideLayer(layer_id) {
    var visibility = this.map.getLayoutProperty(layer_id, 'visibility');
    if (typeof visibility !== 'undefined') {
      if (visibility !== 'none') {
        this.map.setLayoutProperty(layer_id, 'visibility', 'none');
      }
    }
  }

  /**
   * Gets a map layer by ID.
   * @param {string} layer_id - The ID of the layer to get.
   * @returns {object|void} - The layer object, or logs an error if the layer is not found.
   */
  getLayer(layer_id) {
    const layer = this.map.getLayer(layer_id);
    if (layer) {
      return layer;
    } else {
      return console.error('Layer not found.');
    }
  }

  /**
   * Gets all unique non-default layers from the map.
   * @returns {string[]} - Array of unique layer IDs.
   */
  getLayers() {
    const layers = this.map.getStyle().layers;
    let unique_layers = [];
    layers.forEach(function (layer) {
      if (default_layers.indexOf(layer.id) < 0) {
        unique_layers.push(layer.id);
      }
    });
    return unique_layers;
  }

  addLayer(layer_id, source, style){
    console.log(layer_id, source, style)
    this.map.addSource(layer_id, {
      type: 'geojson',
      data: source
    });

    this.map.addLayer(style);
    this.showLayer(style.id);


  }

  /**
   * Fetches and handles GeoJSON data for a specified component.
   * @param {HTMLElement} geo_json_component - The GeoJSON component.
   */
  getGeoJSON(geo_json_component) {
    if(geo_json_component.loaded){
      geo_json_component.layerStyles.forEach( style => {
        this.addLayer(crypto.randomUUID(), geo_json_component.data, style)
      });
    }
    geo_json_component.addEventListener('layer-loaded', (e) =>{
      console.log('layer loaded...', e)
      geo_json_component.layerStyles.forEach( style => {
        this.addLayer(crypto.randomUUID(), geo_json_component.data, style)
      });
    });
    return
    // fetch(geo_json_component.attrs.src)
    //   .then(response => response.json())
    //   .then(async (data) => {
    //     const layer_id = geo_json_component.attrs.id;
    //     const geoJSONAnalysis = await describeGeoJSON(data);
    //     const layerStyles = generateLayerStyle(geoJSONAnalysis, geo_json_component.attrs, layer_id);
    //     layerStyles.forEach((style, index) => {
    //       this.map.addLayer(style);
    //       this.showLayer(style.id);
    //       this.map.on('click', style.id, (e) => {
    //         if (e.features.length > 0) {
    //           const feature = e.features[0];
    //           let center = [];
    //           if (feature.layer.type === 'fill') {
    //             center = e.lngLat;
    //           } else {
    //             center = feature.geometry.coordinates;
    //           }
    //           this.map.flyTo({ center });
    //           let popup_content = `<h2>No template defined.</h2><p>${JSON.stringify(feature.properties)}</p>`;
    //           if (geo_json_component.template !== null) {
    //             popup_content = populateTemplate(feature.properties, geo_json_component.template);
    //           }
    //           this.showPopup(popup_content, center);
    //         }
    //       });
    //       this.map.on('mouseenter', style.id, () => {
    //         this.map.getCanvas().style.cursor = 'pointer';
    //       });
    //       this.map.on('mouseleave', style.id, () => {
    //         this.map.getCanvas().style.cursor = '';
    //       });
    //     });
    //     this.dispatchEvent(
    //       new CustomEvent('GEO JSON LOADED', {
    //         detail: {
    //           data
    //         }
    //       })
    //     );
    //   })
    //   .catch(error => {
    //     console.log('Error fetching GeoJSON:', error);
    //   });
  }
}
customElements.define('geo-map', GeoMapComponent);

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
  "continent-label",
  'tunnel-oneway-arrow-blue',
  'tunnel-oneway-arrow-white',
  'road-oneway-arrow-blue',
  'road-oneway-arrow-white',
  'bridge-oneway-arrow-blue',
  'bridge-oneway-arrow-white',
  'buildingswithid',
  'nearby-roofs',
  'building',
  'council-wide',
  'council-wide-query',
  'council-wide-borders'
];
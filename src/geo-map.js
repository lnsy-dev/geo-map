import 'https://api.mapbox.com/mapbox-gl-js/v2.9.2/mapbox-gl.js';
import { populateTemplate, getURLValues, ready } from './helpers.js';
import { describeGeoJSON, generateLayerStyle } from "./geo-json-component.js";
import "./pin.js";
import "./sidebar.js";
import  SlideShowControls  from './slideshow.js'
import initializeGeoCoder from './geo-coder.js';
import default_layers from './default-layers.js';
import initializeGeoLocate from './geo-locate.js';
import initializeNavigationControl from './nav-control.js';
import "./find-nearest.js";
import "./layer-list.js";


class GeoMapComponent extends HTMLElement {

  connectedCallback() {
    ready(() => this.initialize())
    setTimeout(() => {
      if(!this.initialized){
        this.initialize()
      }
    }, 3333)
  }

  async initialize(){
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

    this.style = getComputedStyle(this);

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

  handleMoveEnd(e){
    let coords = this.map.getCenter();
    const bounds = this.map.getBounds();
    const zoom = this.map.getZoom();
    this.setAttribute('latitude', coords.lat);
    this.setAttribute('longitude', coords.lng);
    this.setAttribute('zoom', zoom);

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

  /*
    
    Show Popup

   */
  showPopup(content, coordinates){
    const popup = new mapboxgl.Popup({ 
      closeOnClick: true, 
      closeOnMove: false,
    })
    .setLngLat(coordinates)
    .setHTML(content)
    .addTo(this.map)
  }

  mapLoaded(){
    this.geocoder = this.getAttribute('geocoder');
    if(this.geocoder !== null){   
      let bbox = this.getAttribute('search-bounds');
      initializeGeoCoder(this.map, bbox);
    }

    this.geolocate_attribute = this.getAttribute('geolocate')
    if(this.geolocate_attribute !== null){
      initializeGeoLocate(this.map);
    }

    if(this.navigation_control){
      initializeNavigationControl(this.map);
    }

    this.slideshow = this.getAttribute('slideshow');
    if(this.slideshow !== null){
      this.map.addControl(new SlideShowControls(this.map, this.geo_map))
    }

    this.map.on('moveend', (e) => {
      this.handleMoveEnd(e)
    });

    const geo_json_components = this.querySelectorAll('geo-json');
    [...geo_json_components].forEach((geo_json_component) => {
      this.getGeoJSON(geo_json_component);
    })

    this.style.opacity = 1;
    this.handleZoom(this.zoom);
    this.dispatchEvent(new CustomEvent('GEO MAP LOADED'));

  }
  
  showLayer(layer_id){  
    try {
      if (this.map.getLayer(layer_id)) {
        this.map.setLayoutProperty(layer_id, 'visibility', 'visible');
      } else {
        console.warn(`Layer with id ${layer_id} not found.`);
      }
    } catch (error) {
      console.error('Error showing layer:', error);
    }
  }
  hideLayer(layer_id){
    try {
      if (this.map.getLayer(layer_id)) {
        this.map.setLayoutProperty(layer_id, 'visibility', 'none');
      } else {
        console.warn(`Layer with id ${layer_id} not found.`);
      }
    } catch (error) {
      console.error('Error hiding layer:', error);
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
    const layers = this.map.getStyle().layers;
    let unique_layers = []
    // Iterate over the layers and print their IDs
    layers.forEach(function(layer) {
      if(default_layers.indexOf(layer.id) < 0){
        unique_layers.push(layer.id);
      }
    });

    console.log(unique_layers);
    return unique_layers;
  }

  /*
  
    getGeoJSON
    fetches Geo JSON

   */

  getGeoJSON(geo_json_component){
    fetch(geo_json_component.attrs.src)
    .then(response => response.json())
    .then(async (data) => {

      const layer_id = geo_json_component.attrs.id
      // Add the GeoJSON layer to the map
      this.map.addSource(layer_id, {
        type: 'geojson',
        data: data
      });
      // Add a layer to visualize the GeoJSON data
      const geoJSONAnalysis = await describeGeoJSON(data);
      const layerStyles = generateLayerStyle(geoJSONAnalysis, geo_json_component.attrs, layer_id);
      layerStyles.forEach((style, index) => {
        this.map.addLayer(style);
        this.showLayer(style.id);
        // Add click event listener to the map
        this.map.on('click', style.id, (e) => {
          if (e.features.length > 0) {
            const feature = e.features[0];
            let center = []
            if(feature.layer.type === 'fill'){
              center = e.lngLat;
            } else {
              center = feature.geometry.coordinates
            }
            this.map.flyTo({center});
            let popup_content = `<h2>No template defined.</h2><p>${JSON.stringify(feature.properties)}</p>`;
            if(geo_json_component.template !== null){
              popup_content = populateTemplate(feature.properties, geo_json_component.template);
            }
            // Use showPopup method to show the feature's properties
            this.showPopup(popup_content, center);
          }
        });

        // Change the cursor to a pointer when the it enters a feature in the 'geojson-layer'.
        this.map.on('mouseenter', style.id, () => {
          this.map.getCanvas().style.cursor = 'pointer';
        });

        // Change it back to a pointer when it leaves.
        this.map.on('mouseleave', style.id, () => {
          this.map.getCanvas().style.cursor = '';
        });
      });

      this.dispatchEvent(
        new CustomEvent('GEO JSON LOADED', 
          {
            detail: {
              data
            }
          }
        )
      )
    })
    .catch(error => {
      console.log('Error fetching GeoJSON:', error);
    });
  }

}

customElements.define('geo-map', GeoMapComponent);



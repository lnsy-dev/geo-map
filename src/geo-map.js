import "https://unpkg.com/maplibre-gl@latest/dist/maplibre-gl.js";
import DataroomElement from './vendor/dataroom-element.js';
import { ready, getURLValues } from './vendor/helpers.js';
import default_layers  from './default-layers.js';
import default_map_style from './default-style.js';


class GeoMap extends DataroomElement {
  async initialize(){

    // Required Attributes
    // 
    const required_attrs = ['style-url'];
    for(const req_attr of required_attrs){
      if(!this.attrs[req_attr]){
        this.innerHTML = `<error>ERROR: Missing ${req_attr} Attribute</error>`;
        return
      }
    }

    // get URL Values
    const URLvalues = getURLValues();


    // Get attributes that describe the map
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

    this.local_id = crypto.randomUUID()
    this.create('map-container', {id: this.local_id});

    // get key file, if it doesn't exist return blank
    
    this.keys = await fetch('/keys.json').then(res => res.json()).catch(e => "");
    const style_url = this.attrs["style-url"] + `?key=${this.keys.stylekey}`;

    this.map = new maplibregl.Map({
        container: this.local_id, // container id
        style: default_map_style, // style URL
        center: [this.longitude, this.latitude], // starting position [lng, lat]
        zoom: this.zoom // starting zoom
    });

    this.map.on('load', (e)=>{
      this.mapLoaded(e);
    })

    this.map.addControl(
        new maplibregl.NavigationControl({
            visualizePitch: true,
            showZoom: true,
            showCompass: true
        })
    );

    this.map.addControl(
        new maplibregl.TerrainControl({
            source: 'terrainSource',
            exaggeration: 1
        })
    );
  }

  mapLoaded(e){
    console.log('Map Loaded:', e)
  }
}

customElements.define('geo-map', GeoMap)
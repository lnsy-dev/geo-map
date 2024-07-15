// import * as mapboxSdk from 'https://unpkg.com/@mapbox/mapbox-sdk/umd/mapbox-sdk.min.js';
import { findNearestParentOfType } from './helpers.js'

const script = document.createElement('script');
script.src = "https://unpkg.com/@mapbox/mapbox-sdk/umd/mapbox-sdk.min.js";
document.head.appendChild(script);

class FindNearest extends HTMLElement {
  connectedCallback(){

    const map = findNearestParentOfType(this, 'geo-map');
    map.addEventListener('GEO MAP LOADED', (e) => {
      this.init();
    });
    map.addEventListener('MAP MOVED', (e) => {
      this.findNearest(e.detail.coords);
    });

  }

  async init(){
    this.mapboxClient = mapboxSdk({ accessToken: mapboxgl.accessToken});

    this.directions = this.mapboxClient.directions;

    this.search_term = this.getAttribute('search-term');
    if(this.search_term === null){
      this.innerHTML = `<error>search-term attribute is required for Find Nearest Component</error>`
    }
  }

  async findNearest(center){
    const center_arr = [center.lng, center.lat];
    console.log('looking for', this.search_term, 'at', center);
    try {
      // Make a forward geocoding request to find hardware stores near the center point
      const response = await this.mapboxClient.geocoding.forwardGeocode({
        query: this.search_term,
        proximity:center_arr, // Center coordinates [longitude, latitude]
        limit: 3,
        fuzzyMatch: true
      }).send();
      console.log(response);

      const locations = await response.body.features.map(feature => {
        console.log(feature.center, center_arr);
        const distance = this.directions.getDirections({
          profile: 'driving',
          waypoints: [
            {coordinates: feature.center},
            {coordinates: center_arr}
          ]
        }).send().then(response => {
          console.log(response);
          // TODO: add this to the li
          const distance = response.body.routes[0].distance; 
          console.log(distance);
        });

        console.log(distance);
        return `<li>${feature.place_name}</li>`
      }).join('\n');
      this.innerHTML = `<div>
      <h3> Nearest ${this.search_term}</h3>
      <ul>${locations}</ul>
      </div>`
    } catch(e){
      console.log(e);
    }
  }
}

customElements.define('find-nearest', FindNearest)
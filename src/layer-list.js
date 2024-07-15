import { findNearestParentOfType } from './helpers.js'

class LayerList extends HTMLElement {
  connectedCallback(){
    this.map = findNearestParentOfType(this, 'geo-map');
    this.map.addEventListener('GEO MAP LOADED', (e) => {
      this.init();
    });
    this.map.addEventListener('GEO JSON LOADED', (e) => {
      this.init();
    });
  }

  async init(){
    this.innerHTML = ' ';
    const layers = await this.map.getLayers();
    this.container = document.createElement('ul');
    layers.forEach(layer => {
      const li = document.createElement('li');
      const label = document.createElement('label')
      label.innerText = layer;
      const input = document.createElement('input');
      label.appendChild(input);
      li.appendChild(label);
      this.container.appendChild(li);
      input.type = 'checkbox';
      input.checked = true; 
      input.setAttribute('name', layer);
      input.addEventListener('change', (e)=> {
        if(!e.target.checked){
          this.map.hideLayer(layer);
        } else {
          this.map.showLayer(layer);
        }
      })
    })
    this.appendChild(this.container);
  }

  static get observedAttributes() {
    return [];
  }

  attributeChangedCallback(name, old_value, new_value){
    switch(name){
      default:
    }
  }
}

customElements.define('layer-list', LayerList)
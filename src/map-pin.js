class MapPin extends HTMLElement {
  connectedCallback(){
    this.attrs = this.getAttributeNames().reduce((acc, name) => {
      return {...acc, [name]: this.getAttribute(name)};
    }, {});
    const required_attributes = ['latitude', 'longitude'];
    this.observedAttributes = requireed_attributes;

    required_attributes.forEach(attribute => {
      if(typeof this.attrs[attribute] === 'undefined'){
        return console.error(`The attribute ${attribute} is required;`)
      }
    });
    let parent = element.parentElement;
    while (parent && parent.tagName !== 'GEO-MAP') {
      parent = parent.parentElement;
    }
    this.map = parent.map;
    console.log(this.map)
  }

  static get observedAttributes() {
    return ['latitude', 'longitude'];
  }

  attributeChangedCallback(name, old_value, new_value){
  
    switch(name){
      case 'latitude':
        break
      case 'longitude':
        break
      default:
    }
  }

}

customElements.define('map-pin', MapPin)
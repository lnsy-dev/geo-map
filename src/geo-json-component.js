class GeoJSON extends HTMLElement {
  connectedCallback(){
    this.attrs = this.getAttributeNames().reduce((acc, name) => {
      return {...acc, [name]: this.getAttribute(name)};
    }, {});

    const required_attributes = ['src'];
    this.observedAttributes = required_attributes;
    required_attributes.forEach(attribute => {
      if(typeof this.attrs[attribute] === 'undefined'){
        return console.error(`The attribute ${attribute} is required;`)
      }
    });
    if(this.attrs.scale === null){
      this.attrs.scale = 1;
    }
    if(this.attrs.color === null){
      this.attrs.color = "#F00";
    }
    if(this.attrs.opacity === null){
      this.attrs.opacity = 1
    }

    this.template = document.querySelector('template');
  }

}

customElements.define('geo-json', GeoJSON)
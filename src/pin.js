class ClickableMarker extends mapboxgl.Marker {
  // new method onClick, sets _handleClick to a function you pass in
  onClick(handleClick) {
    this._handleClick = handleClick;
    return this;
  }

  // the existing _onMapClick was there to trigger a popup
  // but we are hijacking it to run a function we define
  _onMapClick(e) {
    const targetElement = e.originalEvent.target;
    const element = this._element;

    if (
      this._handleClick &&
      (targetElement === element || element.contains(targetElement))
    ) {
      this._handleClick();
    }
  }
}

class MapPin extends HTMLElement {
  initialized = false;
  connectedCallback() {
    this.attrs = this.getAttributeNames().reduce((acc, name) => {
      return { ...acc, [name]: this.getAttribute(name) };
    }, {});
    const required_attributes = ["latitude", "longitude", "id"];
    this.observedAttributes = required_attributes;
    required_attributes.forEach((attribute) => {
      if (typeof this.attrs[attribute] === "undefined") {
        return console.error(`The attribute ${attribute} is required;`);
      }
    });


    const parent = this.parent = this.parentElement;

    this.parent.addEventListener("GEO MAP LOADED", (e) => {
      console.log("geo-map-loaded");
      this.initialize();
    });
    setTimeout(() => {
      this.initialize();
    }, 111);
  }
  initialize() {
    if(this.initialized) return
    console.log('initialize')
    this.map = this.parent.map;
    if (typeof this.map === undefined) {
      setTimeout(() => {
        this.initialize();
      }, 1111);
    }
    this.marker = new ClickableMarker()
      .setLngLat([
        parseFloat(this.attrs.longitude),
        parseFloat(this.attrs.latitude),
      ])
      .addTo(this.map)
      .onClick(() => {
        this.handleClick()
      });

    this.initialized = true;
  }

  handleClick(){
    const sidebar = this.parent.querySelector('map-sidebar');
    if(sidebar === null){
      const markerHeight = 30;
      const markerRadius = 10;
      const linearOffset = 25;
      const popupOffsets = {
          'top': [0, 0],
          'top-left': [0, 0],
          'top-right': [0, 0],
          'bottom': [0, -markerHeight],
          'bottom-left': [linearOffset, (markerHeight - markerRadius + linearOffset) * -1],
          'bottom-right': [-linearOffset, (markerHeight - markerRadius + linearOffset) * -1],
          'left': [markerRadius, (markerHeight - markerRadius) * -1],
          'right': [-markerRadius, (markerHeight - markerRadius) * -1]
      };

      const popup = new mapboxgl.Popup({
        offset: popupOffsets,
        className: 'map-point-popup'
      })
      .setLngLat([
        parseFloat(this.attrs.longitude),
        parseFloat(this.attrs.latitude),
      ])
      .setHTML(this.innerHTML)
      .setMaxWidth("300px")
      .addTo(this.map);
    } else {
      sidebar.updateContent(this.innerHTML);
    }

  }
  static get observedAttributes() {
    return ["latitude", "longitude"];
  }
  attributeChangedCallback(name, old_value, new_value) {
    switch (name) {
      case "latitude":
        if (!this.marker) return;
        this.marker.setLngLat([
          parseFloat(new_value),
          parseFloat(this.attrs.latitude),
        ]);
        break;
      case "longitude":
        if (!this.marker) return;
        this.marker.setLngLat([
          parseFloat(this.attrs.longitude),
          parseFloat(new_value),
        ]);
        break;
      default:
    }
  }
}
customElements.define("map-pin", MapPin);
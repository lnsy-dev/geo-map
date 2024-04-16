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

    if(typeof this.attrs.zoom === "undefined"){
      this.attrs.zoom = 1;
    }
    if(typeof this.attrs.bearing === "undefined"){
      this.attrs.bearing = 0
    }
    if(typeof this.attrs.pitch === "undefined"){
      // console.warn('Could not find pitch, using the default')
      this.attrs.pitch = 0
    }

    const parent = this.parent = this.parentElement;
    this.parent.addEventListener("GEO MAP LOADED", (e) => {
      this.initialize();
    });
    setTimeout(() => {
      this.initialize();
    }, 111);
  }

  initialize() {
    if(this.initialized) return
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
        this.triggerMarker()
      });

    this.initialized = true;
  }

  triggerMarker(){
    [...this.parent.querySelectorAll('.mapboxgl-popup')].forEach(popup => popup.remove());
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
    setTimeout(()=>{
      this.map.flyTo({
        center: [
          parseFloat(this.attrs.longitude),
          parseFloat(this.attrs.latitude),
        ],
        zoom: this.attrs.zoom,
        bearing: this.attrs.bearing,
        pitch: this.attrs.pitch
      });
    },333)
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

class ClickableMarker extends mapboxgl.Marker {
  onClick(handleClick) {
    this._handleClick = handleClick;
    return this;
  }
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

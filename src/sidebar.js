class MapSidebar extends HTMLElement {
  updateContent(content){
    const main = this.querySelector('main');
    if(main === null){
      this.innerHTML = content;
    } else {
      main.innerHTML = content;
    }
  }
}

customElements.define('map-sidebar', MapSidebar)
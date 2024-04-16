class MapSidebar extends HTMLElement {
  updateContent(content){
    let main = this.querySelector('main');
    if(main === null){
      main = document.createElement('main');
      this.appendChild(main);
      main.innerHTML = content;
    } else {
      main.innerHTML = content;
    }
    this.classList.add('show');
  }
  connectedCallback() {
   
    const closeButton = document.createElement('div');
    closeButton.classList.add('close-button');
    closeButton.innerHTML = 'x'
    closeButton.addEventListener('click', () => {
      this.classList.remove('show');
    });
    this.appendChild(closeButton);
  }
}
customElements.define('map-sidebar', MapSidebar);
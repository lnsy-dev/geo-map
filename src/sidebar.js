class MapSidebar extends HTMLElement {
  updateContent(content){
    console.log(content);
    let main = this.querySelector('main');
    if(main === null){
      main = document.createElement('main');
      this.appendChild(main);
      main.innerHTML = content;
    } else {
      main.innerHTML = content;
    }
    this.classList.add('show');
    document.querySelector('map-container').classList.add('sidebar-open')
  }
  connectedCallback() {
    const closeButton = document.createElement('div');
    closeButton.classList.add('close-button');
    closeButton.innerHTML = 'x'
    closeButton.addEventListener('click', () => {
      this.classList.remove('show');
      document.querySelector('map-container').classList.remove('sidebar-open');

    });
    this.appendChild(closeButton);
  }
}
customElements.define('map-sidebar', MapSidebar);
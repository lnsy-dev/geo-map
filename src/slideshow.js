export default class SlideShowControls {
  onAdd(map){
    this.map = map
    this._container = document.createElement('div')
    this._container.classList = 'mapboxgl-ctrl mapboxgl-ctrl-group'
    this.map_container = document.querySelector('geo-map')
    this.slideshow_index = 0

    const next = document.createElement('button')
    const next_label = document.createElement('span')
    next_label.classList = 'mapbox-ctrl-icon'
    next_label.innerHTML = `<svg height='16px' width='16px'  fill="#2d2d2d" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.0" x="0px" y="0px" viewBox="0 0 32 32" enable-background="new 0 0 32 32" xml:space="preserve"><path d="M17.365,16.01l-6.799,6.744c-0.746,0.746-0.746,1.953,0,2.699c0.754,0.745,1.972,0.745,2.726,0l8.155-8.094  c0.746-0.746,0.746-1.954,0-2.699l-8.155-8.094c-0.754-0.746-1.972-0.744-2.726,0c-0.746,0.745-0.746,1.952,0,2.698L17.365,16.01z"></path></svg>` 
    next.appendChild(next_label)
    this._container.appendChild(next)
    next.addEventListener('click', ()=>
      this.map_container.dispatchEvent( new CustomEvent('NEXT SLIDE'))
    )

    const home = document.createElement('button')
    const home_label = document.createElement('span')
    home_label.classList = 'mapbox-ctrl-icon'
    home_label.innerHTML = `<svg height='16px' width='16px'  fill="#2d2d2d" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" x="0px" y="0px"><g data-name="34 Home"><path d="M27,29.5H5A1.5,1.5,0,0,1,3.5,28V13.43A1.5,1.5,0,0,1,4,12.29L15,2.86a1.51,1.51,0,0,1,2,0l11,9.43a1.5,1.5,0,0,1,.52,1.14V28A1.5,1.5,0,0,1,27,29.5Zm-20.5-3h19V14.12L16,6,6.5,14.12Z"></path></g></svg>`
    home.appendChild(home_label)
    this._container.appendChild(home)
    home.addEventListener('click', ()=> 
      this.map_container.dispatchEvent( new CustomEvent('SHOW HOME'))
    )

    const prev = document.createElement('button')
    const prev_label = document.createElement('span')
    prev_label.classList = 'mapbox-ctrl-icon'
    prev_label.innerHTML = `<svg height='16px' width='16px'  fill="#2d2d2d" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.0" x="0px" y="0px" viewBox="0 0 32 32" enable-background="new 0 0 32 32" xml:space="preserve"><path d="M14.647,16.011l6.799-6.744c0.746-0.746,0.746-1.953,0-2.699c-0.754-0.745-1.972-0.745-2.726,0l-8.155,8.094  c-0.746,0.746-0.746,1.954,0,2.699l8.155,8.094c0.754,0.746,1.972,0.744,2.726,0c0.746-0.745,0.746-1.952,0-2.698L14.647,16.011z"></path></svg>`
    prev.appendChild(prev_label)
    this._container.appendChild(prev)
    prev.addEventListener('click', () => 
      this.map_container.dispatchEvent( new CustomEvent('PREV SLIDE'))
    )
    this.map_container.addEventListener('NEXT SLIDE', (e) => {  this.nextLocation() })
    this.map_container.addEventListener('PREV SLIDE', (e) => {  this.prevLocation() })
    this.map_container.addEventListener('SHOW HOME', (e) => {

         this.selectLocation( this.map_container.querySelector('map-pin'))
      })


    return this._container

  }

  nextLocation(){
    const locations = [...this.map_container.querySelectorAll('map-pin')]
    this.slideshow_index++
    if(this.slideshow_index > locations.length - 1) this.slideshow_index = 0 
    this.selectLocation(locations[this.slideshow_index])
  }

  prevLocation(){
    const locations = [...this.map_container.querySelectorAll('map-pin')]
    this.slideshow_index--
    if(this.slideshow_index < 0) this.slideshow_index = locations.length  - 1
    this.selectLocation(locations[this.slideshow_index])
  }

  selectLocation(location){
    console.log(location);
    if(location === undefined) return
    try{
       ;[...this.map_container.querySelectorAll('map-information-box')].forEach(box => box.remove())

    } catch(e){
      //swallow this error for now
    }


    let speed = location.getAttribute('speed')
    if(speed === null){
      speed = 1.2
    } else {
      speed = parseFloat(speed)
    }


    this.center = [ parseFloat(location.attrs.longitude),  parseFloat(location.attrs.latitude)];
    console.log(this.center);
    this.map.flyTo({
      center: this.center,
      zoom: location.zoom,
      // bearing: location.bearing,
      // pitch: location.pitch,
      speed:speed
    })

    if(this.map_container.popups){
      return
    } else {
      const info_box = document.createElement('map-information-box')
      info_box.innerHTML = location.innerHTML
      this.map_container.appendChild(info_box)
    }


  }

  onRemove(){
    this._container.remove()
    this.map = undefined
  }
}
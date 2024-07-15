function initializeNavigationControl(map){
  const nav_control = new mapboxgl.NavigationControl({
    visualizePitch: true
  })
  map.addControl(nav_control);
  console.log('Added Nav Control')

}

export default initializeNavigationControl
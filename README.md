
## MAP MOVED Event
   - **Description:** This event is triggered when the map is moved (center or zoom level changes).
   - **Usage:**
     ```javascript
     geo_map.addEventListener('MAP MOVED', (event) => {
       const { coords, bounds, zoom } = event.detail;
       // Your custom logic here
     });
     ```
   - **Parameters:**
     - `coords`: The geographical coordinates of the map center.
     - `bounds`: The geographical bounds of the visible map area.
     - `zoom`: The current zoom level of the map.

## loaded Event
   - **Description:** This event is triggered when the GeoMapComponent is fully loaded, and the map is ready for interaction.
   - **Usage:**
     ```javascript
     geo_map.addEventListener('loaded', () => {
       // Your custom logic here
     });
     ```
   - **Parameters:** None.

## GEO JSON LOADED Event
   - **Description:** This event is triggered when the GeoJSON data is successfully loaded onto the map.
   - **Usage:**
     ```javascript
     geo_map.addEventListener('GEO JSON LOADED', (event) => {
       const { coords, bounds, zoom } = event.detail;
       // Your custom logic here
     });
     ```
   - **Parameters:**
     - `coords`: The geographical coordinates of the loaded data.
     - `bounds`: The geographical bounds of the loaded data.
     - `zoom`: The zoom level of the map.


These events provide hooks for developers to perform custom actions or handle specific scenarios when certain conditions are met during the execution of the GeoMapComponent. Developers can attach event listeners to these events and define their own custom logic within the callback functions.
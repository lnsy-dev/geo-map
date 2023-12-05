Certainly! Below is the documentation for the provided JavaScript code, including attributes and events:

## `GeoMapComponent` Custom Element

### Attributes:

1. **`accesstoken` (Required):**
   - **Description:** Mapbox access token for using Mapbox services.
   - **Example:**
     ```html
     <geo-map accesstoken="your-mapbox-access-token"></geo-map>
     ```

2. **`styleurl`:**
   - **Description:** URL of the Mapbox style to be used for the map.
   - **Default Value:** 'mapbox://styles/mapbox/streets-v11' if not provided.
   - **Example:**
     ```html
     <geo-map accesstoken="your-mapbox-access-token" styleurl="your-custom-style-url"></geo-map>
     ```

3. **`latitude`:**
   - **Description:** Initial latitude for the map center.
   - **Default Value:** 0 if not provided.
   - **Example:**
     ```html
     <geo-map accesstoken="your-mapbox-access-token" latitude="37.7749"></geo-map>
     ```

4. **`longitude`:**
   - **Description:** Initial longitude for the map center.
   - **Default Value:** 0 if not provided.
   - **Example:**
     ```html
     <geo-map accesstoken="your-mapbox-access-token" longitude="-122.4194"></geo-map>
     ```

5. **`zoom`:**
   - **Description:** Initial zoom level for the map.
   - **Default Value:** 1 if not provided.
   - **Example:**
     ```html
     <geo-map accesstoken="your-mapbox-access-token" zoom="10"></geo-map>
     ```

6. **`bearing`:**
   - **Description:** Initial bearing of the map.
   - **Default Value:** 0 if not provided.
   - **Example:**
     ```html
     <geo-map accesstoken="your-mapbox-access-token" bearing="45"></geo-map>
     ```

7. **`pitch`:**
   - **Description:** Initial pitch of the map.
   - **Default Value:** 0 if not provided.
   - **Example:**
     ```html
     <geo-map accesstoken="your-mapbox-access-token" pitch="30"></geo-map>
     ```

8. **`locked`:**
   - **Description:** Boolean attribute indicating whether map interaction is locked.
   - **Default Value:** `false` if not provided.
   - **Example:**
     ```html
     <geo-map accesstoken="your-mapbox-access-token" locked></geo-map>
     ```

9. **`navigation-control`:**
   - **Description:** Boolean attribute indicating whether to show the map navigation control.
   - **Default Value:** `false` if not provided.
   - **Example:**
     ```html
     <geo-map accesstoken="your-mapbox-access-token" navigation-control></geo-map>
     ```

10. **`slideshow`:**
    - **Description:** (Attribute exists but is not used or documented in the provided code.)

### Methods:

#### `showLayer(layer_id)`

- **Description:** Show a specific map layer by setting its visibility to 'visible'.
- **Parameters:**
  - `layer_id` (String): The ID of the layer to be shown.

#### `hideLayer(layer_id)`

- **Description:** Hide a specific map layer by setting its visibility to 'none'.
- **Parameters:**
  - `layer_id` (String): The ID of the layer to be hidden.

#### `getLayer(layer_id)`

- **Description:** Get a map layer by its ID.
- **Parameters:**
  - `layer_id` (String): The ID of the layer to be retrieved.
- **Returns:**
  - The map layer with the specified ID.

#### `getLayers()`

- **Description:** Get an array of unique layer IDs from the current map style, excluding default layers.
- **Returns:**
  - An array of unique layer IDs.

#### `getGeoJSON(geoJsonUrl, property)`

- **Description:** Fetch GeoJSON data from a URL and add it as a circle layer to the map.
- **Parameters:**
  - `geoJsonUrl` (String): The URL of the GeoJSON data.
  - `property` (String): The property in GeoJSON data to be used for setting the circle radius.

### Events:

#### `GEO JSON LOADED`

- **Description:** Triggered when GeoJSON data is successfully loaded onto the map.
- **Event Detail:**
  - `data` (Object): The loaded GeoJSON data.
- **Example:**
  ```javascript
  geo_map.addEventListener('GEO JSON LOADED', (event) => {
    const { data } = event.detail;
    // Your custom logic here
  });
  ```

#### `MAP MOVED`

- **Description:** Triggered when the map is moved (center or zoom level changes).
- **Event Detail:**
  - `coords` (Object): The geographical coordinates of the map center.
  - `bounds` (Object): The geographical bounds of the visible map area.
  - `zoom` (Number): The current zoom level of the map.
- **Example:**
  ```javascript
  geo_map.addEventListener('MAP MOVED', (event) => {
    const { coords, bounds, zoom } = event.detail;
    // Your custom logic here
  });
  ```

#### `loaded`

- **Description:** Triggered when the GeoMapComponent is fully loaded, and the map is ready for interaction.
- **Example:**
  ```javascript
  geo_map.addEventListener('loaded', () => {
    // Your custom logic here
  });
  ```
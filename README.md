# geo-map


geo-map is a user-friendly component that serves as a wrapper for the Mapbox API, making it easy to style and embed geo-json components on your website or application. With geo-map, you can quickly and efficiently integrate interactive maps into your project without needing to have advanced knowledge of the Mapbox API. Simply include the geo-map component in your project and start visualizing geographical data in a visually appealing and interactive way.


## The Basics


```html
<geo-map id="geo_map"
  id="geo_map"
  accesstoken={Your Access Token}
  styleurl={Your Style Url}
  latitude= 33.86716840617632
  longitude=-118.12701323464881
  zoom=9
  bearing=0
  pitch=45
  navigation
  geolocate
  geocoder=true
  search-bounds="-118.48176410291592, 33.66337686568919, -117.58037748630301, 34.41894361494393"
>
</geo-map>

```

## geoJson

```html 
<geo-map id="geo_map"
  id="geo_map"
  accesstoken={Your Access Token}
  styleurl={Your Style Url}
  latitude= 33.86716840617632
  longitude=-118.12701323464881
  zoom=9
  bearing=0
  pitch=45
  navigation
  geolocate
  geocoder=true
  search-bounds="-118.48176410291592, 33.66337686568919, -117.58037748630301, 34.41894361494393"
>
<geo-json src="https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_hour.geojson" variable="mag"></geo-json>
</geo-map>

```

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

#### `GEO MAP LOADED`

- **Description:** Triggered when the GeoMapComponent is fully loaded, and the map is ready for interaction.
- **Example:**
  ```javascript
  geo_map.addEventListener('GEO MAP LOADED', () => {
    // Your custom logic here
  });
  ```

---

# Scripts

# Shapefile to GeoJSON Converter
This Node.js script converts a shapefile to GeoJSON format using the `ogr2ogr` command line tool. 
## Prerequisites
- Node.js installed on your system
- `ogr2ogr` command line tool installed on your system
## Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/shapefile-to-geojson.git
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
## Usage
1. Run the script with the following command:
   ```bash
   node convert-shp-to-geojson.js <path_to_shapefile_folder>
   ```
   Example:
   ```bash
   node convert-shp-to-geojson.js /path/to/shapefile/folder
   ```
2. The script will convert the shapefile found in the specified folder to a GeoJSON file and save it in the same folder.
## Note
- Make sure the shapefile folder contains only one shapefile with a .shp extension.
- The script assumes the `ogr2ogr` command line tool is installed globally on your system.
Feel free to customize and modify the script to suit your specific requirements.

---
# GeoJSON Custom Element
The geoJSON custome element allows you to embed GeoJSON in your map. 

## Features
- Supports required attributes: `src`
- Optional attributes: `scale`, `color`, `opacity`
- Uses JavaScript style templates for rendering geojson data
## Usage
1. Include the custom element in your `<geo-map>`` component:
   ```html
   <geo-json src="path/to/geojson/file.json"></geo-json>
   ```
2. Add optional attributes as needed:
   ```html
   <geo-json src="path/to/geojson/file.json" scale="1.5" color="#00F" opacity="0.5"></geo-json>
   ```
## Attributes
- `src` (required): Path to the GeoJSON file.
- `scale` (optional, default: 1): Scale factor for the visualization.
- `color` (optional, default: "#F00"): Color used for rendering.
- `opacity` (optional, default: 1): Opacity value for the visualization.
## Template Example
To customize the visualization, use a template similar to the following example:
```html
<template>
  <div class="earthquake">
    <h1>${mag}</h1>
    <h2>Magnitude</h2>
    <p>${place}</p>
    <friendly-time>${updated}</friendly-time>
  </div>
</template>
```
## Note
Make sure to provide the required `src` attribute when using the `geo-json` custom element.
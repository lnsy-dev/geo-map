const default_map_style = {
            version: 8,
            sources: {
                osm: {
                    type: 'raster',
                    tiles: ['https://a.tile.openstreetmap.org/{z}/{x}/{y}.png'],
                    tileSize: 256,
                    attribution: '&copy; OpenStreetMap Contributors',
                    maxzoom: 19
                },
                // Use a different source for terrain and hillshade layers, to improve render quality
                terrainSource: {
                    type: 'raster-dem',
                    url: 'https://demotiles.maplibre.org/terrain-tiles/tiles.json',
                    tileSize: 256
                },
                hillshadeSource: {
                    type: 'raster-dem',
                    url: 'https://demotiles.maplibre.org/terrain-tiles/tiles.json',
                    tileSize: 256
                }
            },
            layers: [
                {
                    id: 'osm',
                    type: 'raster',
                    source: 'osm'
                },
                {
                    id: 'hills',
                    type: 'hillshade',
                    source: 'hillshadeSource',
                    layout: {visibility: 'visible'},
                    paint: {'hillshade-shadow-color': '#473B24'}
                }
            ],
            terrain: {
                source: 'terrainSource',
                exaggeration: 1
            },
            sky: {}
        }


export default default_map_style

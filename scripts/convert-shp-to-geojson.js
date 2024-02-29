#!/usr/bin/env node

import { exec } from 'child_process';
import path from 'path';
import fs from 'fs';

// Function to convert shapefile to GeoJSON
function convertShpToGeoJSON(inputShpFolder) {
  // Read the directory contents
  fs.readdir(inputShpFolder, (err, files) => {
    if (err) {
      console.error(`Error reading directory: ${err.message}`);
      return;
    }

    // Filter out the file with .shp extension
    const shpFile = files.find(file => file.endsWith('.shp'));
    if (!shpFile) {
      console.error('No .shp file found in the provided folder.');
      return;
    }

    // Define the path to your .shp file and the output GeoJSON file
    const shpPath = path.join(inputShpFolder, shpFile);
    const geoJSONPath = path.join(inputShpFolder, `${path.parse(shpFile).name}.geojson`);

    // Command to convert the shapefile to GeoJSON using ogr2ogr
    const command = `ogr2ogr -f "GeoJSON" ${geoJSONPath} ${shpPath}`;

    // Execute the command
    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error: ${error.message}`);
        return;
      }
      if (stderr) {
        console.error(`StdErr: ${stderr}`);
        return;
      }
      console.log(`StdOut: ${stdout}`);
      console.log(`Shapefile at ${shpPath} was successfully converted to GeoJSON at ${geoJSONPath}`);
    });
  });
}

// Check if a folder path is provided
if(process.argv.length < 3) {
  console.log("Usage: node convert-shp-to-geojson.js <path_to_shapefile_folder>");
  process.exit(1);
}

// Folder path from command line arguments
const folderPath = process.argv[2];

// Check if the folder exists
if (!fs.existsSync(folderPath)) {
  console.log("Error: The provided folder path does not exist.");
  process.exit(1);
}

// Call the function with the provided folder path
convertShpToGeoJSON(folderPath);
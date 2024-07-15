const path = require('path');
const fs = require('fs');
const dotenv = require('dotenv');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

dotenv.config();
const file_name = process.env.OUTPUT_FILENAME || 'geo-map.min.js';

module.exports = {
  entry: ['./src/index.js','./styles/index.css'],
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: file_name
  },
  experiments: {
    outputModule: true,
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader'
        }
      },
      {
        test: /\.css$/i,
        use:['style-loader','css-loader']
     }
    ]
  }
};


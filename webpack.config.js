'use strict';

var path = require('path');
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  devtool: 'source-map',
  entry: './src/app.jsx',
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'bundle.js'
  },
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: 'babel',
        query:
        {
          presets: ['es2015', 'react']
        }
      },
      {
        test: /\.css$/, loader: 'style-loader!css-loader'
      }
    ],
  },
  resolve: {
    extensions: ['', '.jsx', '.js']
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'Vizceral',
      template: './src/index.html',
      inject: true
    })
  ]
};

'use strict';

var path = require('path');
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  devtool: 'source-map',
  entry: './src/app.jsx',
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'bundle.js',
    publicPath: '/'
  },
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: 'babel'
      },
      {
        test: /\.css$/, loader: 'style-loader!css-loader'
      },
      {
        test: /\.json$/, loader: 'json-loader'
      }
    ],
  },
  resolve: {
    extensions: ['', '.jsx', '.js']
  },
  node: {
    console: true,
    fs: 'empty',
    net: 'empty',
    tls: 'empty'
  },
  devServer: {
    historyApiFallback: true,
    proxy: {
      '/api/**': {
          target: 'http://localhost:9090',
          // pathRewrite: { '^/api': '' },
      },
    }
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html',
      inject: true
    })
  ]
};

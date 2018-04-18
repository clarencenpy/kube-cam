'use strict';

const common = require('./webpack.common.js');
const merge = require('webpack-merge');

module.exports = merge(common, {
  devtool: 'source-map',
  devServer: {
    historyApiFallback: true,
    proxy: {
      '/api/**': {
        target: 'http://localhost:9090',
        // pathRewrite: { '^/api': '' },
      },
      '/kubecam/**': {
        target: 'http://localhost:3000',
        // pathRewrite: {'^/kubecam': ''},
      }
    }
  },
});

const webpack = require('webpack');
const path = require('path');
const { parsed: localEnv } = require('dotenv').config();
const withCSS = require('@zeit/next-css');
const withSourceMaps = require('@zeit/next-source-maps')();

const config = ({
  webpack: config => {
    config.plugins.push(new webpack.EnvironmentPlugin(localEnv));
    config.node = {
      fs: 'empty',
      setImmediate: true
    };
    return config;
  }
});

module.exports = withSourceMaps(withCSS(config));

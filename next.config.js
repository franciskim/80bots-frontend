const webpack = require('webpack');
const { parsed: localEnv } = require('dotenv').config();
const withCSS = require('@zeit/next-css');

const config = {
  webpack: config => {
    config.plugins.push(new webpack.EnvironmentPlugin(localEnv));
    config.node = {
      fs: 'empty'
    };
    return config;
  }
};

module.exports = withCSS(config);
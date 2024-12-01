const webpack = require('webpack');
const webpackConfig = require('./webpack.config.js');

const env = process.env.NODE_ENV || 'development';
const config = webpackConfig({ production: env === 'production' });

webpack(config, (err, stats) => {
  if (err || stats.hasErrors()) {
    console.error(err || stats.toString({
      chunks: false,
      colors: true
    }));
    process.exit(1);
  }

  console.log(stats.toString({
    chunks: false,
    colors: true
  }));
});
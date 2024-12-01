const path = require('path');
const webpack = require('webpack');
const nodeExternals = require('webpack-node-externals');
const WebpackShellPluginNext = require('webpack-shell-plugin-next');

const configMap = {
  'development': './src/config/index.js',
  'system': './src/config/sit.js',
  'production': './src/config/prod.js',
}

module.exports = (env) => {
  const isProduction = env.production === true;
  // const configFile = isProduction ? './src/config/prod.js' : './src/config/index.js';
  const configFile = configMap[env.mode || 'development'];
  const isDev = process.env.NODE_ENV === 'development';

  // console.log('env', env)
  // console.log('process.env', process.env.NODE_ENV)

  return {
    entry: './server.js',
    target: 'node',
    externals: [nodeExternals()],
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: 'server.bundle.js',
      publicPath: '/'
    },
    mode: isProduction ? 'production' : 'development',
    // 开发环境启用 watch
    watch: isDev,
    watchOptions: {
      ignored: /node_modules/,
      aggregateTimeout: 300,
      poll: 1000
    },
    devtool: isProduction ? 'source-map' : 'eval-source-map',
    plugins: [
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify(isProduction ? 'production' : 'development')
      }),
      new webpack.NormalModuleReplacementPlugin(
        /^config$/,
        function(resource) {
          resource.request = path.resolve(__dirname, configFile);
        }
      ),
      // 开发环境添加自动启动服务的插件
      ...(isDev ? [
        new WebpackShellPluginNext({
          onBuildStart:{
            scripts: ['echo "Starting webpack build..."'],
            blocking: true,
            parallel: false
          },
          onBuildEnd:{
            scripts: ['nodemon dist/server.bundle.js'],
            blocking: false,
            parallel: true
          }
        })
      ] : [])
    ],
    resolve: {
      modules: [path.resolve(__dirname, 'src'), 'node_modules'],
      alias: {
        config: path.resolve(__dirname, 'config')
      },
      extensions: ['.js']
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env']
            }
          }
        }
      ]
    }
  };
};
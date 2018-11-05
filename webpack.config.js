'use strict'

const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')

const config = {
  entry: ['babel-polyfill', './src/components/index.js'],
  output: {
    path: path.join(__dirname, 'dist'),
    publicPath: '/',
    filename: '[name].[hash:20].js'
  },
  resolve: {
    alias: {
      config: path.join(__dirname, './src/config/'),
      context: path.join(__dirname, './src/context/'),
      stores: path.join(__dirname, './src/stores/'),
      utils: path.join(__dirname, './src/utils/')
    }
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: ['babel-loader']
      },
      {
        test: /\.css$/,
        use: ['style-loader', { loader: 'css-loader', options: { url: false } }]
      },
      {
        test: /\.scss$/,
        use: ['style-loader', { loader: 'css-loader', options: { url: false } }, 'sass-loader']
      },
      {
        test: /\.(png|jpg)$/,
        use: {
          loader: 'file-loader',
          options: {
            name: 'images/[name].[hash:20].[ext]'
          }
        }
      }
    ]
  },
  node: {
    fs: 'empty',
    net: 'empty',
    tls: 'empty'
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: 'src/index.html'
    })
  ]
}

module.exports = (env, argv) => {
  const isDevServer = path.basename(require.main.filename) === 'webpack-dev-server.js'

  if (isDevServer) {
    config.devtool = 'inline-source-map'

    config.devServer = {
      compress: true,
      hot: true,
      port: 8001,
      publicPath: '/'
    }

    config.plugins.push(new webpack.HotModuleReplacementPlugin())
  }

  if (!isDevServer) {
    config.plugins.push(new CleanWebpackPlugin(['dist']))
  }

  return config
}

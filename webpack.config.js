var path              = require('path');
var webpack           = require('webpack');
var HtmlPlugin        = require('html-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

var SRC_DIR  = path.resolve(__dirname, 'src');
var DIST_DIR = path.resolve(__dirname, 'dist');

module.exports = {
  // Input:
  context: SRC_DIR,
  entry: {
    app: './app.jsx', // 'app' is chunk name & './' has to be added.
    vendor: [
      'lodash',
      'react', 'react-dom'
    ]
  },
  // :Input
  output: {
    path: DIST_DIR,
    filename: '[name].bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        loader: 'babel-loader',
        include: SRC_DIR
      },
      // Test:
      /*
      {
        test: /\.css?$/,
        loader: 'style-loader!css-loader',
        include: SRC_DIR
      }
      */
      {
        test: /\.css?$/,
        loader: ExtractTextPlugin.extract ({
          fallback: 'style-loader',
          use: 'css-loader'
        }),
        include: SRC_DIR
      }
      // :Test
    ]
  },
  devServer: {
    contentBase: DIST_DIR,
    stats: {
      chunks:  false, // default: true
      modules: false  // default: true
    },
    hot: true
  },
  devtool: 'source-map',
  resolve: {
    extensions: ['.js', '.jsx'], // default: ['.js', '.json']
    alias: {
      styles: path.resolve(SRC_DIR, 'styles')
    }
  },
  plugins: [
    new webpack.optimize.CommonsChunkPlugin ({
      names: ['commons', 'vendor', 'bootstrap']
    }),
    new HtmlPlugin ({
      template: path.resolve(SRC_DIR, 'index.html'),
      inject: 'head' // default: 'body'
    }),
    new webpack.HotModuleReplacementPlugin(),
    new ExtractTextPlugin ({
      filename: '[name].bundle.css',
      allChunks: true
    })
  ]
};

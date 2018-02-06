const path              = require('path');
const webpack           = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const SRC_DIR  = path.resolve(__dirname, 'src');
const DIST_DIR = path.resolve(__dirname, 'dist');

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
    loaders: [
      {
        test: /\.jsx?$/,
        loader: "babel-loader",
        include: SRC_DIR
      },
      {
        test: /\.css?$/,
        loader: "style-loader!css-loader",
        include: SRC_DIR
      }
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
    new HtmlWebpackPlugin ({
      template: path.resolve(SRC_DIR, 'index.html'),
      inject: 'head' // default: 'body'
    }),
    new webpack.HotModuleReplacementPlugin()
  ]
};

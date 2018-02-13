const path              = require('path');
const webpack           = require('webpack');
const HtmlPlugin        = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const SRC_DIR  = path.resolve(__dirname, 'src');
const DIST_DIR = path.resolve(__dirname, 'dist');

const isProduction = (process.env.NODE_ENV==='production') ? true : false;
const processCss = isProduction ? '?minimize!postcss-loader' : '';

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
      {
        test: /\.(css|scss|sass)$/,
        loader: ExtractTextPlugin.extract ({
          fallback: 'style-loader',
          //use: 'css-loader!postcss-loader!sass-loader'
          use: `css-loader${processCss}!sass-loader`
        }),
        include: SRC_DIR
      },
      {
        test: /\.(jpe?g|png)$/,
        loader: 'file-loader',
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
      styles: path.resolve(SRC_DIR, 'styles'),
      images: path.resolve(SRC_DIR, 'assets/images')
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
      allChunks: true,
      //disable: !isProduction
    })
  ]
};

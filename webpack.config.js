const path               = require('path');
const HtmlWebpackPlugin  = require('html-webpack-plugin');
const CommonsChunkPlugin = require('webpack/lib/optimize/CommonsChunkPlugin');

const SRC_DIR  = path.resolve(__dirname, 'src');
const DIST_DIR = path.resolve(__dirname, 'dist');

module.exports = {
  // input:
  context: SRC_DIR,
  entry: {
    app: './app.jsx', // 'app' is chunk name & './' has to be added.
    vendor: [
      'lodash',
      'react', 'react-dom'
    ]
  },
  // :input
  output: {
    path: DIST_DIR,
    filename: '[name].bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        loader: "babel-loader",
        include: SRC_DIR
      }
    ]
  },
  devServer: {
    contentBase: DIST_DIR,
    inline: true,
    historyApiFallback: true,
    //stats: 'errors-only'
    stats: {
      colors:  true,
      reasons: true,
      chunks:  false,
      modules: false
    }
  },
  devtool: 'source-map',
  resolve: {
    extensions: ['.js', '.jsx'] // default: ['.js', '.json']
  },
  plugins: [
    new HtmlWebpackPlugin ({
      template: path.resolve(SRC_DIR, 'index.html'),
      inject: 'head' // default: 'body'
    }),
    new CommonsChunkPlugin ({
      names: ['commons', 'vendor', 'bootstrap']
    })
  ]
};

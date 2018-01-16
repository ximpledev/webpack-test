var path               = require('path');
var HtmlWebpackPlugin  = require('html-webpack-plugin');
var CommonsChunkPlugin = require('webpack/lib/optimize/CommonsChunkPlugin');

var SRC_DIR  = path.resolve(__dirname, 'src');
var DIST_DIR = path.resolve(__dirname, 'dist');

module.exports = {
  // input:
  context: SRC_DIR,
  entry: {
    app: './app.js', // 'app' is chunk name & './' has to be added.
    vendor: ['lodash']
  },
  // :input
  output: {
    path: DIST_DIR,
    filename: '[name].bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: "babel-loader",
        include: SRC_DIR
      }
    ]
  },
  devtool: 'source-map',
  devServer: {
    contentBase: DIST_DIR,
    inline: true,
    //stats: 'errors-only'
    stats: {
      colors:  true,
      reasons: true,
      chunks:  false,
      modules: false
    }
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

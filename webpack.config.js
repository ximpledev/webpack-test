var path = require('path');
var HtmlPlugin = require('html-webpack-plugin');

var SRC_DIR  = path.join(__dirname, 'src');
var DIST_DIR = path.join(__dirname, 'dist');

module.exports = {
  // input:
  context: SRC_DIR,
  entry: {
    app: './app.js', // 'app' is chunk name & './' has to be added.
  },
  // :input
  output: {
    path: DIST_DIR,
    filename: 'bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        include: SRC_DIR,
        //exclude: /node_modules/,
        loader: "babel-loader"
      }
    ]
  },
  devServer: {
    contentBase: DIST_DIR,
    inline: true,
    stats: 'errors-only'
  },
  plugins: [
    new HtmlPlugin ({
      template: path.join(SRC_DIR, 'index.html')
    })
  ]
};

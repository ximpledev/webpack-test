var path = require('path');

var SRC_DIR  = path.join(__dirname, 'src');
var DIST_DIR = path.join(__dirname, 'dist');

module.exports = {
  entry: path.join(SRC_DIR, 'app.js'),
  output: {
    path: DIST_DIR,
    filename: 'bundle.js'
  }
};

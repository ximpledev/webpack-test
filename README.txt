- create src, dist folders
- npm init
- npm i -D webpack
- add src/app.js, dist/index.html
- add webpack.config.js

- edit app.js
alert('I love Webpack!');

- edit index.html
<!DOCTYPE html>
<html>
  <head>
    <title>Webpack Test</title>
  </head>
  <body>
    <h1>Hello Webpack!</h1>
    <script src='bundle.js'></script>
  </body>
</html>

==========

- edit webpack.config.js
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

- terminal> webpack

==========


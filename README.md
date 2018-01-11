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

- add .gitignore
node_modules/
dist/

==========

- update webpack.config.js
context: SRC_DIR,
entry: {
  app: './app.js', // 'app' is chunk name; './' has to be added.
}

- add fav.js for app.js to import
var fav = 'Webpack is my fav!';
module.exports = fav;

- update app.js
var fav = require('./fav');
alert(fav);

==========

- update package.json to use npm scripts
"scripts": {
  "start": webpack,
  ...
}

- update package.json to use watch mode
"start": webpack --watch,

==========

refs: (
  - google babel
  - click its Docs > Setup
  - choose Webpack
)

- npm i -D babel-loader babel-core

(- npm i -D babel-preset-es2015) <- told by Matt, but old
- npm i -D babel-preset-env

- update webpack.config.js
module: {
  rules: [
    {
      test: /\.js$/,
      include: SRC_DIR,
      //exclude: /node_modules/,
      loader: "babel-loader"
    }
  ]
}

- add .babelrc
{
  "presets": [
    "env"
  ]
}

- change src/fav.js & src/app.js to ES6 syntax
src/fav.js
const fav = 'Xup yo, Webpack!';
export default fav;

src/app.js
import fav from './fav';
alert(fav);

==========

[start using babel runtime]

ref... (
  - Docs > Plugins
  - search 'runtime', click it
)

- npm i -D babel-plugin-transform-runtime
- npm i -S babel-runtime

- update .babelrc
"plugins": [
  "transform-runtime"
]

(but we don't know how to check if it's working, just use it)

==========

[webpack-dev-server]

- npm i -D webpack-dev-server

- update package.json
"start": "webpack-dev-server",

- update webpack.config.js
devServer: {
  contentBase: DIST_DIR,
  inline: true,
  stats: 'errors-only'
}

- remove dist/bundle.js
- npm start
- http://localhost:8080/

now,
--watch isn't needed
after modifying files,
webpack-dev-server, which serves a webpack bundle without writing it to disk, automatically watches files and refreshes pages for us

==========

[html-webpack-plugin]

- move dist/index.html to src/index.html
- remove dist folder

- npm i -D html-webpack-plugin

- update src/index.html
(remove <script src='bundle.js'></script>)

- update webpack.config.js
var HtmlPlugin = require('html-webpack-plugin');
...
plugins: [
  new HtmlPlugin ({
    template: path.join(SRC_DIR, 'index.html')
  })
]

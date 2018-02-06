- create src, dist folders
> npm init
> npm i -D webpack
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

var SRC_DIR  = path.resolve(__dirname, 'src');
var DIST_DIR = path.resolve(__dirname, 'dist');

module.exports = {
  entry: path.resolve(SRC_DIR, 'app.js'),
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

> npm i -D babel-loader babel-core

> npm i -D babel-preset-env

- update webpack.config.js
module: {
  rules: [
    {
      test: /\.js$/,
      loader: "babel-loader",
      //exclude: /node_modules/
      include: SRC_DIR
    }
  ]
}

- add .babelrc
{
  "presets": [
    [
      "env",
      {"modules": false}
    ]
  ]
}

where "modules": false means it won't transform ES6 module syntax to another module type.
if we don't use {"modules": false}, default is transforming ES6 module syntax to commonjs.

see PS below

- change src/fav.js & src/app.js to ES6 syntax
src/fav.js
const fav = 'Xup yo, Webpack!';
export default fav;

src/app.js
import fav from './fav';
alert(fav);

----------

PS,
if we want to use ES6 module syntax in webpack.config.js
first, rename webpack.config.js to webpack.config.babel.js
which means letting babel take care of it.
but webpack.config.babel.js runs in Node, that is, we have to transform it to commonjs

to sum up,
if we want to use webpack.config.babel.js
change .babelrc presets to ["env"] only
"presets": [
  "env"
]

otherwise, use
"presets": [
  [
    "env",
    {"modules": false}
  ]
]

==========

[start using babel runtime]

ref... (
  - Docs > Plugins
  - search 'runtime', click it
)

> npm i -D babel-plugin-transform-runtime
> npm i -S babel-runtime

- update .babelrc
"plugins": [
  "transform-runtime"
]

(but we don't know how to check if it's working, just use it)

==========

[webpack-dev-server]

> npm i -D webpack-dev-server

- update package.json
"start": "webpack-dev-server",

- update webpack.config.js
devServer: {
  contentBase: DIST_DIR,
  inline: true,
  // historyApiFallback relates to HTML5 histroy API. I don't know how to use it
  // yet, but just set it to true for now.
  historyApiFallback: true,
  //stats: 'errors-only'
  stats: {
    colors:  true,
    reasons: true,
    chunks:  false,
    modules: false
  }
}

devServer: {
  contentBase: DIST_DIR,
  
  // Note:
  // 'inline': true is the default value, so ignore it for now and don't care
  // about what inline mode & iframe mode are.
  /*
  inline: true,
  */
  
  // Note:
  // When using the HTML5 History API, the index.html page will likely have to
  // be served in place of any 404 responses. Setting 'historyApiFallback' to
  // true enables this feature. But don't care about it for now cuz we haven't
  // used HTML5 History API yet.
  /*
  historyApiFallback: true,
  */
  
  // Note:
  // 'stats' here could be a string or an object. Use string if we want to get
  // minimal info; use object if we want to get more info.
  /*
  stats: 'errors-only'
  */
  stats: {
    chunks: false,
    modules: false
  }
  // :Note
},

- remove dist/bundle.js
> npm start
- http://localhost:8080/

now,
--watch isn't needed
after modifying files,
webpack-dev-server, which serves webpack bundles from memory (not from disk), automatically watches files and refreshes pages for us

==========

- update package.json
"scripts": {
  "start": "webpack-dev-server",
  "build": "webpack",
  ...
}

from now on

cuz 'start' is an npm keyword, 'run' isn't needed,
> npm start
to use webpack-dev-server and no 'dist' folder is built

if needed
> npm run build
to use webpack to build stuff in 'dist' folder

==========

[html-webpack-plugin]

- move dist/index.html to src/index.html
- remove dist folder

> npm i -D html-webpack-plugin

- update src/index.html
(remove <script src='bundle.js'></script>)

- update webpack.config.js
var HtmlPlugin = require('html-webpack-plugin');
...
plugins: [
  new HtmlPlugin ({
    template: path.resolve(SRC_DIR, 'index.html'),
    inject: 'head' // default: 'body'
  })
]

==========

[source map]

- update webpack.config.js
devtool: 'source-map',

==========

[commons chunk plugin]
start using commons chunk plugin
& [chunkhash]
where chunkhash isn't necessary for beginners

> npm i -S lodash
PS, not -D

- update app.js (to use lodash)
import _ from 'lodash';
import fav from './fav';

let s = '';
_.forEach (
  fav,
  (item) => {
    s += `${item} `;
  }
);

alert(s);

- update fav.js
const fav = [
  'Xup',
  'yo,',
  'Webpack!'
];

export default fav;

- update webpack.config.js
var CommonsChunkPlugin = require('webpack/lib/optimize/CommonsChunkPlugin');

entry: {
  ...
  vender: ['lodash']
},

output: {
  path: DIST_DIR,
  filename: '[name].[chunkhash].bundle.js'
}

plugins: [
  ...
  new CommonsChunkPlugin ({
    name: ['commons', 'vendor', 'bootstrap']
  })
]

==========

[React]

> npm i -S react react-dom
PS, React is required for app to run, use -S rather than -D

> npm i -D babel-preset-react

- update .babelrc
"presets": [
  ...
  "react"
]

- update index.html
<div id='main'></div>

- add app.jsx
console.log('Hello World!');

import React    from 'react';
import ReactDOM from 'react-dom';
import Counter  from './counter';

document.addEventListener (
  'DOMContentLoaded',
  () => {
    ReactDOM.render (
      React.createElement(Counter),
      document.getElementById('main')
    );
  }
);

- add counter.jsx
import React from 'react';

class Counter extends React.Component {
  constructor() {
    super();

    this.state = {
      count: 0,
    };
  }

  render() {
    return (
      <button
        onClick={() => {
          this.setState ({
            count: this.state.count + 1
          });
        }}>
        Count: {this.state.count}
      </button>
    );
  }
}

export default Counter;

- update webpack.config.js

replace test: /\.js$/
with test: /\.jsx?$/
where x? means: matching zero or one x.

module.exports = {
  ...
  entry: {
    app: './app.jsx', // 'app' is chunk name & './' has to be added.
    vendor: [
      'lodash',
      'react', 'react-dom'
    ]
  },
  rules: [
    {
      test: /\.jsx?$/,
      ...
    }
  ],
  ...
  resolve: {
    extensions: ['.js', '.jsx'] // default: ['.js', '.json']
  },
  ...
};

==========

[CSS]

> npm i -D css-loader style-loader

- update webpack.config.js

modules: {
  rules: [
    ...,
    {
      test: /\.css?$/,
      loader: "style-loader!css-loader",
      include: SRC_DIR
    }
  ]
}

from now on, we're able to import CSS file through relative path.
ex:
import './styles/footer.css';

==========

(optional)

HMR (Hot Module Replacement)

- update webpack.config.js

module.exports = {
  ...
  devServer: {
    ...
    hot: true
  },
  plugins: [
    ...
    new new webpack.HotModuleReplacementPlugin()
  ]
}

==========

[alias]

- update webpack.config.js

resolve: {
  ...
  alias: {
    styles: path.resolve(SRC_DIR, 'styles')
  }
},
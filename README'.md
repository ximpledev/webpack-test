- create src, dist folders

> npm init

don't install webpack globally

> npm i -D webpack webpack-cli

where
i means install
-D means --save-dev

that is,
npm i -D webpack webpack-cli
is equal to
npm install --save-dev webpack webpack-cli

=====

- add & edit src/app.js
alert('I love Webpack!');

- add & edit dist/index.html
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

=====

- add & edit webpack.config.js
const path = require('path');

const SRC_DIR  = path.resolve(__dirname, 'src');
const DIST_DIR = path.resolve(__dirname, 'dist');

module.exports = {
  entry: path.resolve(SRC_DIR, 'app.js'),
  output: {
    path: DIST_DIR,
    filename: 'bundle.js'
  }
};

-----

we should set webpack's mode,
or it will default to 'production'
& give us a warning

we'll set its mode later
but for now, just use the default one
& ignore the warning

=====

> npx webpack

which is equal to call
> node_modules/.bin/webpack

- add .gitignore
node_modules/
dist/

==========

- update webpack.config.js
context: SRC_DIR,
entry: {
  app: './app.js', // 'app' is chunk name; './' has to be added.
}

where
context is an absolute string
to the directory that contains the entry files.

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

p.s.,
just like
> npx webpack

using npm script has the same result,
that is,
when we update package.json
  "start": webpack

& then call
> npm start

which is equal to call
> ./node_modules/.bin/webpack

- update package.json to use watch mode
"start": webpack --watch,

==========

refs: (
  - google 'babel'
  - click 'Setup' tab
  - choose Webpack
)

to see the lastest ways of install babel

> npm i -D babel-loader @babel-core

- update webpack.config.js

there're 2 ways of updating it...

#1: using include
module: {
  rules: [
    {
      test: /\.js$/,
      include: SRC_DIR,
      loader: "babel-loader"
    }
  ]
}

#2. using exclude
module: {
  rules: [
    {
      test: /\.js$/,
      exclude: /node_modules/,
      loader: "babel-loader"
    }
  ]
}

I prefer #1.

-----

> npm i -D @babel/preset-env

- add .babelrc
{
  "presets": ["@babel/preset-env"]
}

p.s.,
in the older version of Babel
we considered setting its "modules",
that is,
{
  "presets": [
    [
      "@babel/preset-env",
      {"modules": false}
    ]
  ]
}

where {"modules": false} means
it won't transform ES6 module syntax to another module type.

if we don't use {"modules": false},
default is transforming ES6 module syntax to commonjs.

but now,
if we don't use {"modules": false},
default is auto,

The default auto will automatically select false if ES6 module syntax is already
supported by the caller, or "commonjs" otherwise.

(ref:
https://stackoverflow.com/questions/55792519/what-does-the-modulesauto-means-in-babel-preset-env-field)

to sum up,
we're able to ignore it now
& let the default value (aka, auto) to decide for us

so just use
{
  "presets": ["@babel/preset-env"]
}

=====

- change src/fav.js & src/app.js to ES6 syntax
src/fav.js
const fav = 'Xup yo, Webpack!';
export default fav;

src/app.js
import fav from './fav';
alert(fav);

==========

[start using babel runtime]

(basic idea:
if we don't use babel runtime,
babel embeds the helper functions to our code 
to help converting ES2015 (aka, ES6) code to ES5, etc.
whenever we require them.
babel runtime is like a helper-function collection.
using babel runtime to stop embedding the same helper functions
over & over again)

ref... (
  - Docs > Plugins
  - search 'runtime', click it
)

> npm i -D @babel/plugin-transform-runtime

> npm i -P babel-runtime
(or just
> npm i babel-runtime
cuz -P is the default)

p.s.,
> npm i --save babel-runtime
> npm i -S babel-runtime
are old ways of installing it to 'dependencies'
but don't use them anymore
just use -P instead

-----

- update .babelrc
"plugins": ["@babel/plugin-transform-runtime"]

(but we don't know how to check if it's working, just use it)

==========

before continuing
let's split webpack.config.js into dev & prod
which is the new feature of Webpack 4

- add webpack.dev.config.js & webpack.prod.config.js

- rename webpack.config.js to webpack.base.config.js

- copy the content of webpack.base.config.js to dev & prod

- add
mode: "development"
to webpack.dev.config.js
mode: "production"
to webpack.prod.config.js

- remove dev & prod's input & output,
//context: SRC_DIR,
//entry: {
//  ...
//},
//output: {
//  ...
//}

-----

- remove dev & prod's Babel module
//module: {
//  rules: [
//    {
//      test: /\.js$/,
//      include: SRC_DIR,
//      loader: "babel-loader"
//    }
//  ]
//}

-----

> npm i -D webpack-merge

add 
const base = require('./webpack.base.config');
const merge = require('webpack-merge');
to dev & prod

then change dev & prod's
module.exports = {
  ...
};

to 
module.exports = merge(base, {
  ...
});

-----

after updating,

[webpack.base.config.js] 

const path = require('path');

const SRC_DIR  = path.resolve(__dirname, 'src');

module.exports = {
  // input:
  context: SRC_DIR,
  entry: {
    app: './app.js'
  },
  // :input
  module: {
    rules: [
      {
        test: /\.js$/,
        include: SRC_DIR,
        loader: "babel-loader"
      }
    ]
  }
};

[webpack.dev.config.js]

const base  = require('./webpack.base');
const merge = require('webpack-merge');
const path  = require('path');

const DIST_DIR = path.resolve(__dirname, 'dist');

module.exports = merge(base, {
  mode: "development",
  output: {
    path: DIST_DIR,
    filename: 'bundle.js'
  }
});

[webpack.prod.config.js]

const base  = require('./webpack.base');
const merge = require('webpack-merge');
const path  = require('path');

const DIST_DIR = path.resolve(__dirname, 'dist');

module.exports = merge(base, {
  mode: "production",
  output: {
    path: DIST_DIR,
    filename: 'bundle.js'
  }
});

-----

- update package.json

"start": "webpack --config webpack.dev.config.js" --watch
"build": "webpack --config webpack.prod.config.js" 

p.s.,
cuz 'start' is an npm keyword, 'run' isn't needed
but 'build' isn't an npm keyword, 'run' is needed

that is,
we can use
> npm start
to perform the 'start' script,

but we have to use
> npm run build
to perform the 'build' script

==========

[webpack-dev-server]

in package.json, instead of using "--watch"
that is,
"start": "webpack --config webpack.dev.config.js" --watch
there's a better choice
=> using webpack-dev-server...
why?

using --watch writes files to disk that we don't really need
such as: dist/bundle.js (which is needed in prod, not in dev)

webpack-dev-server, which serves webpack bundles from memory (not from disk),
automatically watches files and refreshes pages for us
so, using webpack-dev-server is better for dev

-----

> npm i -D webpack-dev-server

- update webpack.config.js
devServer: {
  contentBase: DIST_DIR
}

-----

webpack-dev-server has more options, but not necessary...

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
    colors:  true,
    reasons: true,
    chunks:  false,
    modules: false
  }
  // :Note
},

so, just use
devServer: {
  contentBase: DIST_DIR,
  stats: {
    colors:  true,
    reasons: true,
    chunks:  false,
    modules: false
  }
},

-----

- update package.json
"start": "webpack-dev-server --config webpack.dev.config.js",

- use --open
to tell dev-server to open the browser after server had been started
=>
"start": "webpack-dev-server --config webpack.dev.config.js --open",

=>
"scripts": {
  "start": "webpack-dev-server --config webpack.dev.config.js --open",
  "build": "webpack --config webpack.prod.config.js",
  ...
},

from now on

for dev,
> npm start
to use webpack-dev-server and no 'dist' folder is built

for prod,
> npm run build
to use webpack to build stuff in 'dist' folder

-----

- remove dist/bundle.js

> npm start

cuz we add --open at the end of the 'start' script
http://localhost:8080/
will be opened automatically

==========

[html-webpack-plugin]

- move dist/index.html to src/index.html
- remove dist folder

> npm i -D html-webpack-plugin

- update src/index.html
(remove <script src='bundle.js'></script>)

- update webpack.base.config.js
const HtmlWebpackPlugin = require('html-webpack-plugin');

plugins: [
  new HtmlWebpackPlugin ({
    template: path.resolve(SRC_DIR, 'index.html'),
    inject: 'head' // default: 'body' <- ?????? why not use default
  })
]

==========

removed in webpack v.4
/*
[caching]

start using commons-chunk-plugin
with the help of [chunkhash]

> npm i lodash
p.s., without -D

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
const webpack = require('webpack');

entry: {
  ...
  vender: ['lodash']
},

output: {
  path: DIST_DIR,
  filename: '[name].[chunkhash].bundle.js'
},

plugins: [
  new webpack.optimize.CommonsChunkPlugin ({
    names: ['app', 'vendor', 'manifest']
  }),
  ...
]

where
the name 'manifest' (instead of 'bootstrap', used by Matt)
is commonly used.

in the case above,
only lodash is used,
so we only need to put it in vender: [...]
aka,
vender: ['lodash']
later,
we need more vender libs,
such as: react, etc.
add them to vender: [...]
aka,
vender: ['lodash', 'react']

-----

p.s.,
after my experiments,

plugins: [
  new webpack.optimize.CommonsChunkPlugin ({
    names: ['app', 'vendor', 'manifest']
  }),
  ...
]

plugins: [
  new webpack.optimize.CommonsChunkPlugin ({
    names: ['commons', 'vendor', 'manifest']
  }),
  ...
]

and even

plugins: [
  new webpack.optimize.CommonsChunkPlugin ({
    names: ['vendor', 'manifest']
  }),
  ...
]

all three names have same result, use any one you like

and be careful, the order matters!
'vendor' must be included prior to 'manifest'

I prefer
plugins: [
  new webpack.optimize.CommonsChunkPlugin ({
    names: ['app', 'vendor', 'manifest']
  }),
  ...
]

PS,
the name prior to 'vendor',
whether it's 'app', 'commons', or other name: 'app2', 'app123', etc.
doesn't matter, they all have the same result

PS,
I want to name it Webpack, that is,

const Webpack = require('webpack');

but in Webpack's source code,
it uses webpack, so I use

const webpack = require('webpack');

like what webpack docs do

==========

[HashedModuleIdsPlugin]

if we change the content of, for instance, app.js

app.bundle.js and manifest.bundle.js change as well
vector remains the same
as we expected

but if we add/remove some files,
for instance, remove fav.js and add fav2.js with same content

in app.js
import fav from './fav2';

then, even vendor's content doesn't change
vendor.bundle.js changes

to solve this,
there are two plugins to use:
NamedModulesPlugin or HashedModuleIdsPlugin
just use HashedModuleIdsPlugin

- update webpack.config.js

plugins: [
  new webpack.optimize.CommonsChunkPlugin ({
    names: ['app', 'vendor', 'manifest']
  }),
  new webpack.HashedModuleIdsPlugin(),
  ...
]

problem solved!

ref:
https://webpack.js.org/guides/caching/

PS,
if we want to 1. set the file names different to chunk names
or 2. want to set more options

split one CommonsChunkPlugin

plugins: [
  new webpack.optimize.CommonsChunkPlugin ({
    names: ['app', 'vendor', 'manifest']
  }),
  new webpack.HashedModuleIdsPlugin(),
  ...
]

into multiple CommonsChunkPlugin

for instance,
plugins: [
  new webpack.optimize.CommonsChunkPlugin ({
    name: 'app',
    filename: 'app2.js'
  }),
  new webpack.optimize.CommonsChunkPlugin ({
    name: 'vendor',
    filename: 'vendor2.js',
    //minChunks: Infinity
  }),
  new webpack.optimize.CommonsChunkPlugin ({
    name: 'manifest',
    filename: 'manifest2.js',
    //minChunks: Infinity
  }),
  new webpack.HashedModuleIdsPlugin(),
  ...
]

I prefer using one CommonsChunkPlugin for simplicity.
*/

==========

[caching] (webpack v.4)

-----

before continuing
introduce webpack-bundle-analyzer first

> npm i -D webpack-bundle-analyzer

ref:
https://github.com/webpack-contrib/webpack-bundle-analyzer

- update webpack.base.config.js

const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = {
  plugins: [
    new BundleAnalyzerPlugin()
  ]
}

-----

> npm i lodash
p.s., without -D

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

> npm start
it works.

-----

ref...
https://webpack.js.org/guides/caching/

start using optimization, runtimeChunk, & splitChunks.cacheGroups, etc.
with the help of [contenthash]

- update webpack.base.config.js
output: {
  path: DIST_DIR,
  filename: '[name].[contenthash].js'
},

then,
step 1.
extracting boilerplate

- update webpack.base.config.js
optimization: {
  runtimeChunk: 'single'
},

p.s.,
which is the equivalent of
optimization: {
  runtimeChunk: {
    name: 'runtime'
  }
},

I prefer using 'single'

then
step 2.
extract third-party libs

- update webpack.base.config.js
optimization: {
+ moduleIds: 'hashed',
  runtimeChunk: 'single',
+ splitChunks: {
+   cacheGroups: {
+     vendors: {
+       test: /[\\/]node_modules[\\/]/,
+       name: 'vendors',
+       chunks: 'all',
+     },
+   },
+ },
},

p.s.,
just use the settings above,
which are copied from the webpack docs

-----

[CleanWebpackPlugin]

> npm start
it works (& runs in webpack-dev-server)
nothing added to dist/

> npm run build
it works,
but because we use [contenthash]

everytime the code is changed & rebuild,
a new app.*.bundle.js is created
that is,
there're more and more app.*.bundle.js in dist/

so we use CleanWebpackPlugin
to clean the dist/ for us

> npm i clean-webpack-plugin
(no -D cuz it's mainly used for prod)

- update webpack.prod.config.js
const {CleanWebpackPlugin} = require('clean-webpack-plugin');

plugins: [
  new CleanWebpackPlugin()
]

now
> npm run build
there's only one app.*.bundle.js in dist/

==========

[source map]

- update webpack.dev.config.js
devtool: 'source-map'

==========

[React]

> npm i react react-dom
PS, React is required for app to run, don't use -D

> npm i -D babel-preset-react

- update .babelrc
"presets": [
  ...
  "react"
]

- update index.html
<div id='main'></div>

- add app.js
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

- add counter.js
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

entry: {
  app: './app.js', // 'app' is chunk name & './' has to be added.
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

resolve: {
  extensions: ['.js', '.jsx'] // default: ['.js', '.json']
}

==========

[CSS]

> npm i -D css-loader style-loader

- update webpack.config.js

modules: {
  rules: [
    ...,
    {
      test: /\.css$/,
      use: ['style-loader', 'css-loader'],
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

devServer: {
  ...
  hot: true
},

plugins: [
  ...
  new new webpack.HotModuleReplacementPlugin()
]

PS,
if we want to use [chunkhash] later,
HMR must be disabled, or compilation will fail.

PS,
it's OK to use [hash/contenthash] when HMR is enabled.

PS,
[hash] is used by file-loader
[contenthash] is used by extract-text-plugin

PS,
cuz using HMR makes [chunkhash] useless and I possibly want to use [chunkhash],
plus HMR is a bit complicated to set up,
so I prefer not to use HMR

PS,
to me, using webpack-dev-server,
which automatically watches files and refreshes pages for us,
is good enough for developing

and, for production,
it's OK to use webpack without watching
cuz we just use it to create some files in /dist

==========

[alias]

- update webpack.config.js

resolve: {
  ...
  alias: {
    styles: path.resolve(SRC_DIR, 'styles')
  }
},

==========

[extract-text-plugin]

> npm i -D extract-text-webpack-plugin

update webpack.config.js

const ExtractTextPlugin = require('extract-text-webpack-plugin');

replace

module: {
  rules: [
    ...
    {
      test: /\.css$/,
      use: ['style-loader', 'css-loader'],
      include: SRC_DIR
    }
  ]
}

with

module: {
  rules: [
    ...
    {
      test: /\.css$/,
      use: ExtractTextPlugin.extract ({
        fallback: 'style-loader',
        use: 'css-loader'
      }),
      include: SRC_DIR
    }
  ]
}

and then, add

plugins: [
  ...
  new ExtractTextPlugin ({
    filename: '[name].bundle.css',
    allChunks: true
  })
]

hasn't figured out what 'allChunks' is entirely,
but I know setting 'allChunks: true' makes all CSS not be embedded,
so just set 'allChunks: true' for now.

also, cuz no CSS are embedded,
fallback: 'style-loader' in ExtractTextPlugin.extract({}) seems not necessary,
but just keep it.

PS,
if we want to use [chunkhash] like JS bundles,
use [contenthash] instead cuz neither [hash] nor [chunkhash] work
when using the ExtractTextWebpackPlugin

that is,

plugins: [
  ...
  new ExtractTextPlugin ({
    filename: '[name].[contenthash].css',
    allChunks: true
  })
]

==========

[SASS (pre-processors)]

> npm i -D node-sass sass-loader

- update webpack.config.js

replace

module: {
  rules: [
    ...
    {
      test: /\.css$/,
      use: ExtractTextPlugin.extract ({
        fallback: 'style-loader',
        use: 'css-loader'
      }),
      include: SRC_DIR
    }
  ]
}

with

module: {
  rules: [
    ...
    {
      test: /\.(css|scss|sass)$/,
      use: ExtractTextPlugin.extract ({
        fallback: 'style-loader',
        use: ['css-loader', 'sass-loader']
      }),
      include: SRC_DIR
    }
  ]
}

then replace CSS with SCSS

and remember to replace

e.g.
import 'styles/main.css';

with
import 'styles/main.scss';

==========

[PostCSS (autoprefixer)]

> npm i -D autoprefixer postcss-loader

- add postcss.config.js (option 1)

module.exports = {
  plugins: [
    require('autoprefixer')
  ]
};

or

- update package.json (option 2)

"postcss": {
  "plugins": {
    "autoprefixer": {}
  }
},

(I prefer option 2)

- update webpack.config.js

replace

module: {
  rules: [
    ...
    {
      test: /\.(css|scss|sass)$/,
      use: ExtractTextPlugin.extract ({
        fallback: 'style-loader',
        use: ['css-loader', 'sass-loader']
      }),
      include: SRC_DIR
    }
  ]
}

with

module: {
  rules: [
    ...
    {
      test: /\.(css|scss|sass)$/,
      use: ExtractTextPlugin.extract ({
        fallback: 'style-loader',
        use: ['css-loader', 'postcss-loader', 'sass-loader']
      }),
      include: SRC_DIR
    }
  ]
}

- update package.json

add

"browserslist": [
  "> 1%",
  "ie > 9"
],

==========

[file-loader]

> npm i -D file-loader

(in our sample, the 'file' to load in an image,
so it's OK to use an image-related loader to load.
but, for simplicity, we just use file-loader)

- update webpack.config.js

add

module: {
  rules: [
    ...
    {
      test: /\.(jpe?g|png)$/,
      use: ['file-loader'],
      include: SRC_DIR
    }
  ]
}

where jpe?g means matching 'e' 0 or 1 time,
that is, jpe?g = jpg or jpeg

then...
if we want to use alias,

- update webpack.config.js

resolve: {
  alias: {
    ...
    images: path.resolve(SRC_DIR, 'assets/images')
  }
}

and change our CSS (or SCSS)

for instance,

from

body {
  background: url('../assets/images/test.jpg');
}

to

body {
  background: url('~images/images/test.jpg');
}

not

body {
  background: url('images/images/test.jpg');
}

cuz CSS uses relative paths
if we use url('images/images/test.jpg')
CSS tries to resolve it to url('./images/images/test.jpg')

but if we put '~' before the path,
webpack knows we want to use the path in absolute way and will resolves it for us

==========

[minify CSS]

there're 2 ways to minify CSS.

1. use css-loader options

- update webpack.config.js

replace

module: {
  rules: [
    ...
    {
      test: /\.(css|scss|sass)$/,
      use: ExtractTextPlugin.extract ({
        fallback: 'style-loader',
        use: ['css-loader', 'postcss-loader', 'sass-loader']
      }),
      include: SRC_DIR
    },
    ...
  ]
}

with

module: {
  rules: [
    ...
    {
      test: /\.(css|scss|sass)$/,
      use: ExtractTextPlugin.extract ({
        fallback: 'style-loader',
        use: [
          {
            loader: 'css-loader',
            options: {
              minimize: true
            }
          },
          'postcss-loader',
          'sass-loader'
        ]
      }),
      include: SRC_DIR
    },
    ...
  ]
}

2. use 'webpack -p' in package.json,
where -p switches webpack loaders to minimize mode.

see [build script] below for further explanation.

I prefer solution 2.

==========

[build script]

- update package.json

change

"scripts": {
  "start": "webpack-dev-server",
  "build": "webpack",
  ...
},

to

"scripts": {
  "start": "set NODE_ENV=development && webpack-dev-server --progress",
  "build": "set NODE_ENV=production && webpack -p --progress",
  ...
},

where -p is a shortcut for production,
which equals to --optimize-minimize --optimize-occurrence-order
where --optimize-minimize minimizes JS and switches loaders (such as: CSS) to minimize mode

a little complicated, but it's OK, just use -p for production.

and --progress prints compilation progress in percentage

----------

PS,
"set NODE_ENV=production && webpack-dev-server" adds a trailing space to the variable.
that is, NODE_ENV will become 'production ', not 'production'

to solve this, 2 solutions:

1.
use "set NODE_ENV=production&&webpack-dev-server" or
use "set NODE_ENV=production&& webpack-dev-server"

2. in webpack.config.js, use trim() to trim spaces,
for instance,
const env = process.env.NODE_ENV || 'development';
const isProduction = (env.trim()==='production') ? true : false;

I prefer solution 2.

----------

PS,
npm scripts are different in Windows & Linux,
in Linux, we just need to set...

"scripts": {
  "start": "NODE_ENV=development webpack-dev-server --progress",
  "build": "NODE_ENV=production webpack -p --progress",
  ...
},

- update webpack.config.js

add

const env = process.env.NODE_ENV || 'development';
const isProduction = (env.trim()==='production') ? true : false;

replace

module: {
  rules: [
    ...
    {
      test: /\.(css|scss|sass)$/,
      use: ExtractTextPlugin.extract ({
        fallback: 'style-loader',
        use: [
          {
            loader: 'css-loader',
            options: {
              minimize: true
            }
          },
          'postcss-loader',
          'sass-loader'
        ]
      }),
      include: SRC_DIR
    },
    ...
  ]
]

with

module: {
  rules: [
    ...
    {
      test: /\.(css|scss|sass)$/,
      use: ExtractTextPlugin.extract ({
        fallback: 'style-loader',
        use: (
          // Part 1.
          !isProduction ?
          // Part 2.
          [
            'css-loader',
            'sass-loader'
          ] :
          // Part 3.
          [
            {
              loader: 'css-loader',
              options: {
                minimize: true
              }
            },
            'postcss-loader',
            'sass-loader'
          ]
        )
      }),
      include: SRC_DIR
    },
    ...
  ]
]

to minify CSS & use PostCSS only in production mode

besides,

plugins: [
  ...
  new ExtractTextPlugin ({
    filename: '[name].bundle.css',
    allChunks: true,
    //disable: !isProduction
  })
]

we can use extract-text-plugin only in production mode as well
by disable: !isProduction
but I want to extract text whether in production or development mode
so I comment it out.

==========

[cross-env]

when using npm scripts on Windows
for instance,

"scripts": {
  "start": "set NODE_ENV=development && webpack-dev-server",
  ...
},

we have to add 'set' before NODE_ENV
but on Mac, we don't

that is, it's OK to write the snippet below
"scripts": {
  "start": "NODE_ENV=development webpack-dev-server",
  ...
},

in order not to write two version of start (or any other scripts),
use 'cross-env', which is a Node package.

> npm i -D cross-env

- update package.json

from

"scripts": {
  "start": "set NODE_ENV=development && webpack-dev-server",
  ...
}

to

"scripts": {
  "start": "cross-env NODE_ENV=development webpack-dev-server",
  ...
}

be careful,
not only replace 'set' with 'cross-env',
but remove '&&' as well,
or it won't work

------

PS,
cross-env is a cross-platform solution for setting environment variable, such as: NODE_ENV

Similarly, Windows Command Prompt (cmd) has no 'rm' command
and there's a cross-platform solution for 'rm', called 'rimraf'

but cuz we use Git Bash, not cmd
it's OK to use 'rm'

==========

[refactor npm scripts]

- update package.json

"scripts": {
  "clean": "rm -rf ./dist",
  "build:dev": "cross-env NODE_ENV=development webpack-dev-server --progress",
  "build:prod": "cross-env NODE_ENV=production webpack -p --progress",
  "start": "npm run build:dev",
  "build": "npm run clean && npm run build:prod",
  ...
},

and then
we're able to use
> npm start
to run the program in development mode, and
> npm run build
to run the program in production mode.

==========

[env in Webpack 2]

[ref]
https://blog.flennik.com/the-fine-art-of-the-webpack-2-config-dc4d19d7f172

in Webpack 2,
there is a better way to set env
that is, use --env

- update package.json

from

"scripts": {
  ...
  "build:dev": "cross-env NODE_ENV=development webpack-dev-server --progress",
  "build:prod": "cross-env NODE_ENV=production webpack -p --progress",
  "start": "npm run build:dev",
  "build": "npm run clean && npm run build:prod",
  ...
}

to

"scripts": {
  ...
  "build:dev": "webpack-dev-server --progress",
  "build:prod": "webpack --env.prod -p --progress",
  "start": "npm run build:dev",
  "build": "npm run clean && npm run build:prod",
  ...
}

- update webpack.config.js

1. remove

const env = process.env.NODE_ENV || 'development';
const isProduction = (env.trim()==='production') ? true : false;

2. change

module.exports = {
  ...
}

to

module.exports = (env={}) => {
  const isProduction = (env.prod===true) ? true : false;

  return {
    ...
  };
};

PS, we must give env a default value {},
or it could be undefined if we don't assign --env
(such as: --env.dev, --env.prod, etc.) in npm scripts

3. cuz we don't need cross-env anymore
> npm uninstall -D cross-env

4. instead of letting webpack loaders (such as: css-loader) decide
whether its own minification is necessary (by tuning option),
uniformly let npm scripts (that is, webpack -p) to decide
whether all minifications (not just CSS) is necessary.

- update webpack.confg.js

from

module: {
  rules: [
  {
    test: /\.(css|scss|sass)$/,
    use: ExtractTextPlugin.extract ({
      fallback: 'style-loader',
      use: (
        // Part 1.
        (!isProduction) ?
        // Part 2: dev.
        [
          'css-loader',
          'sass-loader'
        ] :
        // Part 3: prod.
        [
          {
            loader: 'css-loader',
            options: {
              minimize: true
            }
          },
          'postcss-loader',
          'sass-loader'
        ]
      )
    }),
    include: SRC_DIR
  },
  ...
}

to

module: {
  rules: [
  {
    test: /\.(css|scss|sass)$/,
    use: ExtractTextPlugin.extract ({
      fallback: 'style-loader',
      use: (
        // Part 1.
        (!isProduction) ?
        // Part 2: dev.
        ['css-loader', 'sass-loader'] :
        // Part 3: prod.
        ['css-loader', 'postcss-loader', 'sass-loader']
      )
    }),
    include: SRC_DIR
  },
  ...
}

5. set devtools differently for dev/prod

- update webpack.config.js

from

devtool: 'source-map',

to

devtool: (!isProduction) ? 'source-map' : 'hidden-source-map',

----------

but if we use Webpack 1.x
--env isn't supported
use NODE_ENV instead

==========

[chunkhash/contenthash]

after having ability to identify dev/prod
it's time to add some chunkhash/contenthash

first, we want to use hash-length 8

- update webpack.config.js

const HASH_LENGTH = 8;

-----

replace

output: {
  path: DIST_DIR,
  filename: '[name].bundle.js'
},

with

output: {
  path: DIST_DIR,
  filename: (
    // Part 1.
    !isProduction ?
    // Part 2: dev.
    `[name].[chunkhash:${HASH_LENGTH}].js` :
    // Part 3: prod.
    `[name].bundle.js`
  )
},

-----

replace

module: {
  rules: [
    ...
    {
      test: /\.(jpe?g|png)$/,
      use: ['file-loader'],
      include: SRC_DIR
    }
  ]
}

with

module: {
  rules: [
    ...
    {
      test: /\.(jpe?g|png)$/,
      use: [
        {
          loader: 'file-loader',
          options: {
            name: (
              // Part 1.
              !isProduction ?
              // Part 2: dev.
              `[hash:${HASH_LENGTH}].[ext]` :
              // Part 3: prod.
              `[hash].[ext]` // which is the default.
            )
          }
        }
      ],
      include: SRC_DIR
    }
  ]
}

-----

replace

plugins: [
  ...
  new ExtractTextPlugin ({
    filename: '[name].bundle.css',
    allChunks: true,
    //disable: !isProduction
  })
]

with

plugins: [
  ...
  new ExtractTextPlugin ({
    filename: (
      // Part 1.
      !isProduction ?
      // Part 2: dev.
      `[name].[contenthash:${HASH_LENGTH}].css` : // not chunkhash!
      // Part 3: prod.
      `[name].bundle.css`
    ),
    allChunks: true,
    //disable: !isProduction
  })
]

==========

[webpack.config.js vs. CLI]

webpack & webpack-dev-server have many similar options, which are useful
such as: --colors & --progress

but 1. they have their own defaults

and 2. webpack -p is a very useful shortcut (which has been mentioned above)

plus, 3. those options are convenient, not crucial

so here's my conclusion!

cuz in webpack.config.js, there's a devServer to config
move webpack-dev-server CLI to webpack.config.js
and let webpack uses CLI

--colors

webpack uses --colors=false as default
enable it using webpack CLI

webpack-dev-server uses --colors=true as default,
but, for consistency, we still enable it in webpack.config.js

devServer: {
  ...
  stats: {
    colors: true, // default: true
    ...
  }
  ...
}

> webpack --env.prod -p --colors

--progress

webpack-dev-server uses --progress=false as default
enable it in webpack.config.js

devServer: {
  ...
  progress: true
  ...
},

webpack also uses --progress=false as default,
enable it using webpack CLI

> webpack --env.prod -p --colors --progress

PS,
--color & --colors are both OK in webpack & webpack-dev-server CLI
but in webpack.config.js

devServer: {
  ...
  stats: {
    colors: true, //color: true,
    ...
  }
}

stats only knows colors, not color
if we use color, nothing will happen
and it just uses the default value, which is --colors=true

so uniformly, I prefer using --colors for both webpack & webpack-dev-server


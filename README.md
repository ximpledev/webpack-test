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
      use: ['babel-loader'],
      //exclude: /node_modules/
      include: SRC_DIR
    }
  ]
}

- add .babelrc (option 1)
{
  "presets": [
    [
      "env",
      {"modules": false}
    ]
  ]
}

or

- update package.json, not webpack.config.js (option 2)

"babel": {
  "presets": [
    [
      "env",
      {"modules": false}
    ],
    "react"
  ],
  "plugins": [
    "transform-runtime"
  ]
},

where "modules": false means it won't transform ES6 module syntax to another module type.
if we don't use {"modules": false}, default is transforming ES6 module syntax to commonjs.

(I prefer option 2)

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
> npm i babel-runtime

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
const HtmlPlugin = require('html-webpack-plugin');

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

[caching]

start using commons-chunk-plugin
with the help of [chunkhash]

> npm i lodash
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

where the name 'manifest' (instead of 'bootstrap', used by Matt) is commonly used.

PS,
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

-----

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


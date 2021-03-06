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
      test: /\.(css|sass|scss)$/i,
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
      test: /\.(css|sass|scss)$/i,
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

=====

HMR (Hot Module Replacement)

(optional)

- update webpack.config.js

devServer: {
  ...
  hot: true
},

plugins: [
  ...
  new new webpack.HotModuleReplacementPlugin()
]

p.s.,
if we want to use [chunkhash] later,
HMR must be disabled, or compilation will fail.

p.s.,
it's OK to use [hash/contenthash] when HMR is enabled.

p.s.,
[hash] is used by file-loader
[contenthash] is used by extract-text-plugin

p.s.,
cuz using HMR makes [chunkhash] useless and I possibly want to use [chunkhash],
plus HMR is a bit complicated to set up,
so I prefer not to use HMR

p.s.,
to me, using webpack-dev-server,
which automatically watches files and refreshes pages for us,
is good enough for developing

and, for production,
it's OK to use webpack without watching
cuz we just use it to create some files in /dist

=====

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

p.s.,
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

p.s.,
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
      test: /\.(css|sass|scss)$/i,
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
      test: /\.(css|sass|scss)$/i,
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

p.s.,
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

p.s., we must give env a default value {},
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
    test: /\.(css|sass|scss)$/i,
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
    test: /\.(css|sass|scss)$/i,
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
      test: /\.(jpe?g|png)$/i,
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
      test: /\.(jpe?g|png)$/i,
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

p.s.,
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

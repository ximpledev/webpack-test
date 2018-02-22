const path              = require('path');
const webpack           = require('webpack');
const HtmlPlugin        = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const SRC_DIR  = path.resolve(__dirname, 'src');
const DIST_DIR = path.resolve(__dirname, 'dist');

const HASH_LENGTH = 8;

module.exports = (env={}) => {
  console.log(`env.prod: ${env.prod}`);
  const isProduction = (env.prod===true) ? true : false;

  return {
    // Input:
    context: SRC_DIR,
    entry: {
      app: './app.jsx', // 'app' is chunk name & './' has to be added.
      vendor: [
        'lodash',
        'react', 'react-dom'
      ]
    },
    // :Input
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
    module: {
      rules: [
        {
          test: /\.jsx?$/,
          use: ['babel-loader'],
          include: SRC_DIR
        },
        {
          test: /\.(css|scss|sass)$/,
          use: ExtractTextPlugin.extract ({
            fallback: 'style-loader',
            use: (
              // Part 1.
              !isProduction ?
              // Part 2: dev.
              ['css-loader', 'sass-loader'] :
              // Part 3: prod.
              ['css-loader', 'postcss-loader', 'sass-loader']
            )
          }),
          include: SRC_DIR
        },
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
    },
    devServer: {
      contentBase: DIST_DIR,
      stats: {
        chunks:  false, // default: true
        modules: false  // default: true
      },
      // Test: To use [chunkhash].

      hot: true,

      progress: true
    },
    devtool: (!isProduction) ? 'source-map' : 'hidden-source-map',
    resolve: {
      extensions: ['.js', '.jsx'], // default: ['.js', '.json']
      alias: {
        styles: path.resolve(SRC_DIR, 'styles'),
        images: path.resolve(SRC_DIR, 'assets/images')
      }
    },
    plugins: [
      new webpack.optimize.CommonsChunkPlugin ({
        names: ['commons', 'vendor', 'manifest']
      }),
      new HtmlPlugin ({
        template: path.resolve(SRC_DIR, 'index.html'),
        inject: 'head' // default: 'body'
      }),
      // Test: To use [chunkhash].

      new webpack.HotModuleReplacementPlugin(),

      new ExtractTextPlugin ({
        filename: (
          // Part 1.
          !isProduction ?
          // Part 2: dev.
          `[name].[contenthash:${HASH_LENGTH}].css` : // contenthash, not chunkhash!
          // Part 3: prod.
          `[name].bundle.css`
        ),
        allChunks: true,
        //disable: !isProduction
      })
    ],
  };
};

/* @flow */

const { resolve } = require('path');

const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

const context = resolve(__dirname, 'src');

module.exports = () => ({
  target: 'web',
  context,

  entry: {
    app: './app.js',
  },

  output: {
    path: resolve(__dirname, 'build'),
    filename: '[name]-[hash].js',
  },

  resolve: {
    extensions: ['.js', '.json', '.js', '.css'],
  },

  module: {
    rules: [
      {
        test: /\.js$/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              babelrc: false,
              exclude: 'node_modules/**',
              presets: [
                '@babel/flow',
                '@babel/react',
                [
                  '@babel/env',
                  {
                    useBuiltIns: 'usage',
                    corejs: { version: 3, proposals: true },
                    modules: false,
                  },
                ],
                '@emotion/babel-preset-css-prop',
              ],
              plugins: [
                'react-hot-loader/babel',
                ['@babel/proposal-optional-chaining', { loose: false }],
                ['@babel/proposal-pipeline-operator', { proposal: 'minimal' }],
                [
                  '@babel/proposal-nullish-coalescing-operator',
                  { loose: false },
                ],
                '@babel/proposal-numeric-separator',
                '@babel/syntax-dynamic-import',
                ['@babel/proposal-class-properties', { loose: false }],
                'babel-plugin-emotion',
              ],
            },
          },
        ],
      },
    ],
  },

  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      meta: {
        viewport: Object.entries({
          width: 'device-width',
          'initial-scale': '1.0',
          'maximum-scale': '1.0',
          'minimum-scale': '1.0',
          'user-scalable': 'no',
        })
          .map(entry => entry.join('='))
          .join(','),
      },
    }),
    new webpack.HotModuleReplacementPlugin(),
  ],

  devServer: {
    hot: true,
    historyApiFallback: true,
    port: 8080,
    https: true,
  },
});

/* @flow */

import { resolve } from 'path';

import webpack from 'webpack';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import CleanWebpackPlugin from 'clean-webpack-plugin';

process.env.NODE_ENV = process.env.NODE_ENV || 'development';
const ENV = process.env.NODE_ENV;
const DEV = ENV === 'development';
const PROD = ENV === 'production';

const modules = resolve(__dirname, 'node_modules');
const context = resolve(__dirname, 'src');

export default {
  mode: ENV,
  target: 'web',
  devtool: DEV && 'inline-source-map',
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
        exclude: [modules],

        loader: 'babel-loader',
        options: {
          plugins: ['react-hot-loader/babel'],
          presets: [
            '@babel/flow',
            '@babel/react',
            [
              '@babel/env',
              {
                targets: {
                  browsers: ['last 2 versions'],
                },
                modules: false,
                useBuiltIns: 'usage',
              },
            ],
          ],
        },
      },
    ],
  },

  plugins: [
    new CleanWebpackPlugin(['build']),
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
      template: 'template.html',
      minify: PROD,
    }),
    new webpack.NamedModulesPlugin(),
    new webpack.HotModuleReplacementPlugin(),
  ],

  devServer: {
    hot: true,
    historyApiFallback: true,
    port: 8080,
    https: true,
  },
};

var webpack = require("webpack");
var CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: {
    "strapping": "./plugin/main",
    "demo": "./demo/main",
  },
  output: {
    path: __dirname,
    filename: "./static/build/[name].min.js"
  },
  resolve: {
    extensions: ['.js', '.ts']
  },
  devtool: 'source-map',
  module: {
    loaders: [{
      test: /\.s?css$/,
      loader: 'raw-loader',
    }, {
      test: /\.html$/,
      loader: 'file-loader?name=static/[name].[ext]&outputPath=static/!extract-loader!html-loader?interpolate=true',
    }, {
      test: /\.js$/,
      loader: 'babel-loader?presets[]=es2015',
    }]
  },
  plugins: [
    new CopyWebpackPlugin([{
      from: 'node_modules/sass.js/dist/sass.worker.js',
      to: './static/build/sass.worker.js',
    }, {
      from: 'demo/styles/styles.css',
      to: './static/build/styles.css',
    }, {
      from: 'demo/styles/bootstrap.css',
      to: './static/build/bootstrap.css',
    }]),
  ],
}

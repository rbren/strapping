var webpack = require("webpack");
var CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: {
    "strapping": "./app/main",
  },
  output: {
    path: __dirname,
    filename: "./static/dist/[name].min.js"
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
    }]
  },
  plugins: [
    new CopyWebpackPlugin([{
      from: 'node_modules/sass.js/dist/sass.worker.js',
      to: './static/dist/sass.worker.js',
    }, {
      from: 'app/styles/bootstrap.css',
      to: './static/dist/bootstrap.css',
    }]),
  ],
}

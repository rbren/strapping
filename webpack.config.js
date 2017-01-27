var webpack = require("webpack");
module.exports = {
  entry: {
    "app": "./app/main",
  },
  output: {
    path: __dirname,
    filename: "./static/dist/[name].bundle.js"
  },
  resolve: {
    extensions: ['.js', '.ts']
  },
  devtool: 'source-map',
  module: {
    loaders: [{
      test: /\.scss$/,
      loader: 'raw-loader',
    }]
  },
  plugins: [
  ]
}

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
      test: /\.s?css$/,
      loader: 'raw-loader',
    }, {
      test: /\.html$/,
      loader: 'file-loader?name=static/[name].[ext]&outputPath=static/!extract-loader!html-loader?interpolate=true',
    }]
  },
  plugins: [
  ]
}

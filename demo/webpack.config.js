module.exports = {
  entry: __dirname + '/demo.tsx',
  output: {
    path: __dirname + '/dist',
    filename: 'demo.bundled.js',
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.json'],
  },
  devtool: 'source-map',
  mode: 'production',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'awesome-typescript-loader?configFileName=demo/tsconfig.json',
      },
      { enforce: 'pre', test: /\.js$/, loader: 'source-map-loader' },
    ],
  },
}

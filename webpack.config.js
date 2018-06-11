module.exports = {
  entry: __dirname + '/src/index.ts',
  output: {
    library: 'Scissors',
    libraryTarget: 'umd',
    path: __dirname + '/dist',
    filename: 'scissors.js',
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.json'],
  },
  devtool: 'source-map',
  mode: 'development',
  externals: {
    react: 'React',
    immutable: 'Immutable',
  },
  module: {
    rules: [
      { test: /\.tsx?$/, loader: 'awesome-typescript-loader' },
      { enforce: 'pre', test: /\.js$/, loader: 'source-map-loader' },
    ],
  },
}

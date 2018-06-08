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
      // All files with a '.ts' or '.tsx' extension will be handled by 'awesome-typescript-loader'.
      { test: /\.tsx?$/, loader: 'awesome-typescript-loader' },

      // All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
      { enforce: 'pre', test: /\.js$/, loader: 'source-map-loader' },
    ],
  },
}

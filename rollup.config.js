import sourcemaps from 'rollup-plugin-sourcemaps'
import { uglify } from 'rollup-plugin-uglify'

export default {
  input: 'es/index.js',
  output: {
    file: 'dist/scissors.js',
    name: 'Scissors',
    format: 'umd',
    exports: 'named',
    sourcemap: true,
  },
  plugins: [sourcemaps(), uglify()],
}

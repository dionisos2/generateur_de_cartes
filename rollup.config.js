import buble from 'rollup-plugin-buble'
// import uglify from 'rollup-plugin-uglify'

export default {
  entry: 'src/cards-generator.js',
  dest: 'build/cards-generator.min.js',
  format: 'iife',
  sourceMap: 'inline',
  plugins: [
    buble()
    // uglify()
  ]
}

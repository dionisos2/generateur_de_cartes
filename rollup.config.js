import buble from 'rollup-plugin-buble'
// import uglify from 'rollup-plugin-uglify'

export default {
  input: 'src/cards-generator.js',
  output: {
    file: 'build/cards-generator.min.js',
    format: 'iife',
    sourcemap: 'inline'
  },
  plugins: [
    buble()
    // uglify()
  ]
}

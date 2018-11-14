import copy from 'rollup-plugin-copy-assets'
import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import babel from 'rollup-plugin-babel'
import { uglify } from 'rollup-plugin-uglify'
import serve from 'rollup-plugin-serve'
import livereload from 'rollup-plugin-livereload'

// `npm run build` -> `production` is true
// `npm run dev` -> `production` is false
const production = !process.env.ROLLUP_WATCH

export default {
  input: 'src/main.js',
  output: {
    file: 'public/bundle.js',
    format: 'iife', // immediately-invoked function expression — suitable for <script> tags
    sourcemap: false
  },
  plugins: [
    copy({
      assets: ['./src/assets', './src/index.html']
    }),
    resolve(),
    babel({
      exclude: 'node_modules/**'
    }),
    production && uglify(),
    !production &&
      serve({
        contentBase: 'public',
        port: 3000
      }),
    !production && livereload()
  ]
}

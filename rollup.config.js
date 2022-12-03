import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
// import css from "rollup-plugin-import-css"; // 打包时支持css

import babel from '@rollup/plugin-babel';
import { terser } from "rollup-plugin-terser"

export default {
  input: 'src/index.js',
  output: [
    {
      file: 'dist/Clipper.cjs.js',
      format: 'cjs',
      // compact: true
    },
    {
      file: 'dist/Clipper.es.js',
      format: 'es',
       // compact: true
    },
    {
      file: 'dist/Clipper.iife.js',
      format: 'iife',
      name: 'Clipper',
      // compact: true
    }
  ],
  plugins: [
  	  // css(), // 支持将css打包到js中
      resolve(),  // 这样 Rollup 能找到 `ms`
      commonjs(), // 这样 Rollup 能转换 `ms` 为一个ES模块
      terser(), // 生产环境下压缩代码
      babel({babelHelpers: 'bundled'}),
  ]
};
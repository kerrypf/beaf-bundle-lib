import json from '@rollup/plugin-json'
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import babel from '@rollup/plugin-babel'
import esbuild from 'rollup-plugin-esbuild'; //替换 rollup-plugin-typescript2、@rollup/plugin-typescript 和 rollup-plugin-terser 

import postcss from 'rollup-plugin-postcss'
import autoprefixer from 'autoprefixer'
import cssnano from 'cssnano'
import {version} from 'vue'

import pkg from '../package.json';

const isVue2 = version.split('.')[0] === '2'

const buildVue2BabelOptions = {
  presets: [
    '@babel/preset-env',
    '@babel/preset-typescript',
    ['@vue/babel-preset-jsx', {compositionAPI: true}]
  ],
}
const buildVue3BabelOptions = {
  presets: [
    '@babel/preset-typescript'
  ],
  plugins: [
    '@vue/babel-plugin-jsx'
  ]
}

const babelOptions = isVue2?buildVue2BabelOptions:buildVue3BabelOptions

const extensions = ['.js', '.jsx', '.ts', '.tsx']
export const globals = {
	antd: 'antd',
	vue: 'vue',
	react: 'React',
	moment: 'moment',
	'react-is': 'ReactIs',
	'@alifd/next': 'Next',
	'mobx-react-lite': 'mobxReactLite',
	'react-dom': 'ReactDOM',
	'element-ui': 'Element',
	'element-plus': 'ElementPlus',
	'@ant-design/icons': 'icons',
	'@vue/composition-api': 'VueCompositionAPI',
	'@formily/reactive-react': 'Formily.ReactiveReact',
	'@formily/reactive-vue': 'Formily.ReactiveVue',
	'@formily/reactive': 'Formily.Reactive',
	'@formily/path': 'Formily.Path',
	'@formily/shared': 'Formily.Shared',
	'@formily/validator': 'Formily.Validator',
	'@formily/core': 'Formily.Core',
	'@formily/json-schema': 'Formily.JSONSchema',
	'@formily/react': 'Formily.React',
	'@formily/vue': 'Formily.Vue',
	'vue-demi': 'VueDemi'
}
export const external = Object.keys(globals)
export const presets = ({cssExtract} = {}) => {
	return [
    json(),
		resolve({
      extensions,
    }), // so Rollup can find `ms`
		commonjs(), // so Rollup can convert `ms` to an ES module
    babel({
			babelrc: false,
      babelHelpers: 'bundled',
			...babelOptions,
			extensions,
			exclude: '**/node_modules/**'
		}),
		postcss({
			plugins: [
				autoprefixer(),
				cssnano()
			],
			extensions: ['.css', '.less'],
			extract: cssExtract!==undefined?cssExtract : 'index.css' 
		}),
    // typescript({
    //   sourceMap: false
    // }),
		esbuild({
			define:{
				'process.env.NODE_ENV': JSON.stringify('production')
			},
			sourceMap: process.env.NODE_ENV !== 'production',
      minify: process.env.NODE_ENV === 'production'
		})
		
	]
}


const modulesConfig = {
	esm: {
		module: 'ESNext',
		format: 'es',
		dir: pkg.module
	},
	cjs: {
		module: 'CommonJS',
		format: 'cjs',
		dir: pkg.main
	}
}
export const modulesOutput = Object.entries(modulesConfig).map(([module, config]) => {
	return {
		format: config.format,
		dir: config.dir,
		exports: module=== 'cjs' ? 'named' : undefined,
		sourcemap: true,
		preserveModules: true,
		preserveModulesRoot: 'src',
		globals
	}
})
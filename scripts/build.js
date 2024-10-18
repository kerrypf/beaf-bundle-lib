import pkg from '../package.json';
import {globals, presets, external, modulesOutput} from './config'
import {getFileList} from './utils'
console.info(getFileList(),'getFileList')
export default [
	// browser-friendly UMD build
	{
		input: 'src/index.ts',
		output: {
			name: 'agileUI',
			file: pkg.browser,
			format: 'umd',
			sourcemap: true,
			globals,
		},
		external,
		plugins: [
			...presets(),
		]
	},

	// CommonJS (for Node) and ES module (for bundlers) build.
	// (We could have three entries in the configuration array
	// instead of two, but it's quicker to generate multiple
	// builds from a single configuration where possible, using
	// an array for the `output` option, where we can specify
	// `file` and `format` for each target)
	{
		input: 'src/index.ts',
		output: modulesOutput,
		external,
		plugins: [
			...presets({cssExtract: false}),
		]
	}
];

import typescript from '@rollup/plugin-typescript';
import esbuild from 'rollup-plugin-esbuild'; //替换 rollup-plugin-typescript2、@rollup/plugin-typescript 和 rollup-plugin-terser 
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';

import babel from '@rollup/plugin-babel';
import postcss from 'rollup-plugin-postcss'
import vue from 'rollup-plugin-vue'
// import { uglify } from 'rollup-plugin-uglify';
import { name } from './package.json';
import * as fs from 'fs';
import * as path from 'path';
import clear from 'rollup-plugin-clear'
// import image from '@rollup/plugin-image';

const inputDir = './src';
const extensions = ['.ts', '.js', '.tsx', '.less']
const excludes = ['interface.ts', 'env.d.ts']

const getFileList = (basePath, dirPath) => {
    let inputFiles = {};
    let fileArr = fs.readdirSync(dirPath);
    if (fileArr && fileArr.length) {
        for (let i = 0; i < fileArr.length; i++) {
            const fileName = fileArr[i];
            const filePath = dirPath + '/' + fileName
            const stat = fs.statSync(filePath);
            if (stat.isDirectory()) {
                const childFiles = getFileList(basePath, filePath);
                if (childFiles) {
                    inputFiles = Object.assign(inputFiles, childFiles);
                }
            } else {
                const extname = path.extname(filePath);
                if (extensions.includes(extname) && !excludes.includes(fileName)) {
                    let inputName = filePath.substring(basePath.length, filePath.length - extname.length);
                    if (inputName.startsWith('/')) {
                        inputName = inputName.substring(1);
                    }
                    console.info(inputName)
                    inputFiles[inputName] = filePath;
                }
            }
        }
    }
    return inputFiles;
}

const buildFiles = getFileList(inputDir, inputDir);
console.info('build files:', buildFiles)

export default {
    input: buildFiles,
    output: {
        name,
        dir: 'libs',
        format: 'es',
        // preserveModules: true,
		// preserveModulesRoot: 'src',
        globals: {
            vue: 'Vue'
        },
        entryFileNames: '[name].js'
    },
    external: ['vue'],
    plugins: [
        vue({ preprocessStyles: true }),
        postcss(),
        typescript({
            sourceMap: false
        }),
        // esbuild({
        //     target: 'esnext',
        //     define:{
        //         'process.env.NODE_ENV': JSON.stringify('production')
        //     },
        //     sourceMap: process.env.NODE_ENV !== 'production',
        //     minify: process.env.NODE_ENV === 'production',
        //     tsconfig: './tsconfig.json',
		// }),
        // resolve({
        //  extensions: ['.js', '.jsx', '.ts', '.tsx'],
        // }),
        // commonjs(),
        babel({
            babelHelpers: 'bundled',
            extensions: extensions
        }),
        // uglify(),
        clear({
            target: ['dist', 'libs']
        }),
        // image()
    ]
};

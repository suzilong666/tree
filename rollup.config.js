import fs from 'fs'
import typescript from 'rollup-plugin-typescript2'
import babel from '@rollup/plugin-babel'
import terser from '@rollup/plugin-terser'
import { visualizer } from 'rollup-plugin-visualizer'

// 使用 import.meta.url 构建正确的文件路径
const pkg = JSON.parse(
    fs.readFileSync(new URL('./package.json', import.meta.url), 'utf-8')
)

export default {
    input: 'src/index.ts',
    output: [
        { file: pkg.main, format: 'cjs', sourcemap: true },
        { file: pkg.module, format: 'es', sourcemap: true },
        {
            file: 'dist/index.umd.js',
            format: 'umd',
            name: 'Tree', // 全局变量名
            sourcemap: true,
        },
    ],
    plugins: [
        typescript({
            exclude: ['**/*.test.ts', '**/*.spec.ts'], // 排除测试文件
        }),
        babel({
            babelHelpers: 'bundled',
            presets: [['@babel/preset-env', { targets: { ie: '11' } }]],
        }),
        terser({
            compress: {
                drop_console: true, // 移除 console.log
                drop_debugger: true,
                pure_funcs: ['console.log'], // 移除指定函数
            },
            output: {
                comments: false, // 移除注释
            },
        }),
        visualizer({
            filename: 'reports.html',
            open: true, // 构建后自动打开报告
        }),
    ],
    external: Object.keys(pkg.dependencies || {}),
}

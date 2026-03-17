import fs from 'fs'
import typescript from 'rollup-plugin-typescript2'

// 使用 import.meta.url 构建正确的文件路径
const pkg = JSON.parse(
    fs.readFileSync(new URL('./package.json', import.meta.url), 'utf-8')
)

export default {
    input: 'src/index.ts',
    output: [
        { file: pkg.main, format: 'cjs', sourcemap: true },
        { file: pkg.module, format: 'es', sourcemap: true },
    ],
    plugins: [
        typescript({
            exclude: ['**/*.test.ts', '**/*.spec.ts'], // 排除测试文件
        }),
    ],
    external: Object.keys(pkg.dependencies || {}),
}

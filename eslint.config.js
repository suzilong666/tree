// =====================================================
// ESLint 扁平配置文件 - ES 模块版本 (ESM)
// 适用于 TypeScript 项目，集成 Prettier
// 要求 package.json 中包含 "type": "module"
// =====================================================

import ts from 'typescript-eslint'
import prettierRecommended from 'eslint-plugin-prettier/recommended'
import globals from 'globals'

export default [
    {
        ignores: [
            'dist/**', // 忽略 dist 目录及其所有内容
            'node_modules/**', // 通常 ESLint 默认忽略 node_modules，但显式写上更安全
            '**/*.d.ts', // 忽略 TypeScript 声明文件
            'test/**', // 如果有测试文件夹，也可以选择忽略
            'rollup.config.js',
        ],
    },

    //  TypeScript 推荐规则（注意使用展开运算符）
    ...ts.configs.recommended,

    // 4. TypeScript 文件的特定配置
    {
        files: ['src/**/*.{ts}'], // 匹配所有 TypeScript 文件
        languageOptions: {
            ecmaVersion: 'latest', // 支持最新 ECMAScript 特性
            sourceType: 'module', // 代码使用 ES 模块
            parser: ts.parser, // 使用 TypeScript 解析器
            globals: {
                ...globals.node, // 添加 Node.js 全局变量（如 process、__dirname）
                ...globals.browser, // 如果代码也运行在浏览器，取消注释
            },
        },
        rules: {
            // 自定义规则（覆盖或补充）
        },
    },

    //  Prettier 集成（启用插件并关闭冲突规则）
    prettierRecommended,
]

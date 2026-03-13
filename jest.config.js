// jest.config.js (ESM 项目)
/** @type {import('ts-jest').JestConfigWithTsJest} */
export default {
    preset: 'ts-jest/presets/default-esm', // 使用完整的 ESM 预设路径
    testEnvironment: 'node',
    transform: {
        '^.+\\.tsx?$': [
            'ts-jest',
            {
                useESM: true, // 必须启用 ESM 支持
            },
        ],
    },
    extensionsToTreatAsEsm: ['.ts'], // 将 .ts 文件视为 ESM 模块
    moduleNameMapper: {
        '^(\\.{1,2}/.*)\\.js$': '$1', // 解决导入时 .js 扩展名的问题
    },
}

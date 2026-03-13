/**
 * 确保输入值是一个数组。
 * - 如果已经是数组，直接返回。
 * - 如果是非数组（包括 null/undefined），则包装成单元素数组。
 *   注意：根据你的业务场景，可能需要针对 null/undefined 做特殊处理（如返回空数组）。
 */
export function ensureArray<T>(value: T | T[]): T[] {
    if (value === null || value === undefined) {
        return []
    }
    return Array.isArray(value) ? value : [value]
}

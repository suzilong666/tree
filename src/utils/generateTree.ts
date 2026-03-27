/**
 * 生成一棵深度和宽度均衡的树（用于测试）
 * @param count 节点总数（包括根节点）
 * @returns 树的根节点，每个节点包含 id 和 children 数组
 */
export function generateTree(count: number) {
    if (count <= 0) return null
    const MAX_CHILDREN = 5
    let id = 1
    const root = { id: id++, children: [] }
    const queue = [root]
    let remaining = count - 1
    let queueIndex = 0 // 手动索引代替 shift

    while (remaining > 0 && queueIndex < queue.length) {
        const current = queue[queueIndex++]
        const childCount = Math.min(MAX_CHILDREN, remaining)
        const children = []
        for (let i = 0; i < childCount; i++) {
            const child = { id: id++, children: [] }
            children.push(child)
            queue.push(child)
        }
        current.children = children
        remaining -= childCount
    }
    return root
}

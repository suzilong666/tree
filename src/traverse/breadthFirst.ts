import { BaseOptions, TraversalContext, TreeNode } from '../types/tree'
import { DEFAULT_CHILDREN_KEY } from '../constants/index'
import { ensureArray } from '../utils/array'

export function breadthFirst(
    tree: TreeNode | TreeNode[],
    callback: (node: TreeNode, context: TraversalContext) => void | boolean,
    options: BaseOptions = {}
): void {
    const { childrenKey = DEFAULT_CHILDREN_KEY } = options
    const nodes = ensureArray(tree)
    const queue: Array<{
        node: TreeNode
        parent: TreeNode | null
        depth: number
        path: TreeNode[]
    }> = []

    // 初始化队列：所有根节点
    for (const root of nodes) {
        queue.push({ node: root, parent: null, depth: 0, path: [root] })
    }

    let isStop = false
    while (queue.length > 0 && !isStop) {
        const { node, parent, depth, path } = queue.shift()!

        const context: TraversalContext = { depth, parent, path }
        if (callback(node, context) === false) {
            isStop = true
            break
        }

        const children = node[childrenKey]
        if (Array.isArray(children)) {
            for (const child of children) {
                queue.push({
                    node: child,
                    parent: node,
                    depth: depth + 1,
                    path: [...path, child], // 复制路径
                })
            }
        }
    }
}

import { BaseOptions, Context, TreeNode } from '../types'
import { DEFAULT_CHILDREN_KEY } from '../constants/index'
import { ensureArray } from '../utils/array'

/**
 * 广度优先遍历树（BFS，层级遍历）
 * @param tree 原树或森林
 * @param callback 对每个节点执行的函数，返回 false 可中断遍历
 * @param options 配置选项
 */
export function breadthFirst(
    tree: TreeNode | TreeNode[],
    callback: (node: TreeNode, context: Context) => void | boolean,
    options: BaseOptions = {}
): void {
    const { childrenKey = DEFAULT_CHILDREN_KEY } = options
    const nodes = ensureArray(tree)
    const queue: Array<{
        node: TreeNode
        parent: TreeNode | null
        index: number
        depth: number
        path: TreeNode[]
    }> = []

    // 初始化队列：所有根节点
    for (let index = 0; index < nodes.length; index++) {
        const root = nodes[index]
        queue.push({ node: root, parent: null, index, depth: 0, path: [root] })
    }

    let isStop = false
    while (queue.length > 0 && !isStop) {
        const { node, parent, index, depth, path } = queue.shift()!

        const context: Context = { index, depth, parent, path }
        if (callback(node, context) === false) {
            isStop = true
            break
        }

        const children = node[childrenKey]
        if (Array.isArray(children)) {
            for (let i = 0; i < children.length; i++) {
                const child = children[i]
                queue.push({
                    node: child,
                    parent: node,
                    index: i,
                    depth: depth + 1,
                    path: [...path, child], // 复制路径
                })
            }
        }
    }
}

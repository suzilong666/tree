// src/traverse/depthFirst.ts
import { Context, TreeNode, DepthFirstOptions } from '../types'
import { DEFAULT_CHILDREN_KEY } from '../constants/index'
import { ensureArray } from '../utils/array'

/**
 * 深度优先遍历树（DFS）
 * @param tree 原树或森林
 * @param callback 对每个节点执行的函数，返回 false 可中断遍历
 * @param options 配置选项
 */
export function depthFirst(
    tree: TreeNode | TreeNode[],
    callback: (node: TreeNode, context: Context) => void | boolean,
    options: DepthFirstOptions = {}
): void {
    const { childrenKey = DEFAULT_CHILDREN_KEY } = options
    const order = options.order === 'post' ? 'post' : 'pre'
    const newTree = ensureArray(tree)
    let isStop = false // 用于标记是否需要停止遍历

    function recursion(
        nodes: TreeNode[],
        parent: TreeNode | null,
        depth: number,
        path: TreeNode[]
    ): void {
        for (let i = 0; i < nodes.length; i++) {
            if (isStop) return // 如果标记为停止，直接返回
            const node = nodes[i]
            const currentPath = [...path, node] // 当前路径
            const context: Context = {
                index: i,
                depth,
                parent,
                path: currentPath,
            }
            if (order === 'pre') {
                if (callback(node, context) === false) {
                    isStop = true
                    return
                }
            }
            const children = node[childrenKey]
            if (children && Array.isArray(children)) {
                recursion(children, node, depth + 1, currentPath)
                if (isStop) return // 防止后序遍历时继续执行回调
            }
            if (order === 'post') {
                if (callback(node, context) === false) {
                    isStop = true
                    return
                }
            }
        }
    }

    recursion(newTree, null, 0, [])
}

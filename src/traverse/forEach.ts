// traverse/forEach.ts
import { depthFirst, breadthFirst } from './index'
import { TreeNode, Options, Context } from '../types'
import { DEFAULT_CHILDREN_KEY } from '../constants'

/**
 * 对树中的每个节点执行一次给定的函数（无返回值，不中断）
 * @param tree 树或森林
 * @param callback 对每个节点执行的函数
 * @param options 配置选项
 */
export function forEach(
    tree: TreeNode | TreeNode[],
    callback: (node: TreeNode, context: Context) => void,
    options: Options = {}
): void {
    const {
        childrenKey = DEFAULT_CHILDREN_KEY,
        strategy = 'dfs',
        order = 'pre',
    } = options
    const traverse = strategy === 'bfs' ? breadthFirst : depthFirst

    traverse(tree, callback, { childrenKey, order })
}

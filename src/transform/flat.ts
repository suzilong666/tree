import { breadthFirst, depthFirst } from '../traverse'
import { Options, TreeNode } from '../types'
import { ensureArray } from '../utils/array'
import { DEFAULT_CHILDREN_KEY } from '../constants/index'

/**
 * 将树扁平化为节点数组
 * @param tree 原树或森林
 * @param options 配置选项
 * @returns 包含所有节点的数组
 */
export function flat(
    tree: TreeNode | TreeNode[],
    options: Options = {}
): TreeNode[] {
    const {
        childrenKey = DEFAULT_CHILDREN_KEY,
        strategy,
        order = 'pre',
    } = options
    const traverse = strategy === 'bfs' ? breadthFirst : depthFirst

    const result: TreeNode[] = []
    traverse(
        ensureArray(tree),
        (node) => {
            result.push(node)
        },
        { childrenKey, order }
    )

    return result
}

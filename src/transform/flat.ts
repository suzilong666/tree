import { breadthFirst, depthFirst } from '../traverse'
import { Options, TreeNode } from '../types'
import { ensureArray } from '../utils/array'
import { DEFAULT_CHILDREN_KEY } from '../constants/index'

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

import { TreeNode, TreeOptions } from '../types/tree'
import { DEFAULT_CHILDREN_KEY } from '../constants/index'
import { ensureArray } from '../utils/array'

export function breadthFirst<T>(
    tree: TreeNode<T> | TreeNode<T>[],
    callback: (node: TreeNode<T>) => void,
    options: TreeOptions = {}
): void {
    const { childrenKey = DEFAULT_CHILDREN_KEY } = options
    const nodes = ensureArray(tree)
    const queue: TreeNode<T>[] = [...nodes]

    while (queue.length > 0) {
        const node = queue.shift()!
        callback(node)
        const children = node[childrenKey]
        if (children && Array.isArray(children)) {
            queue.push(...children)
        }
    }
}

// src/traverse/depthFirst.ts
import { TreeNode, TreeOptions } from '../types/tree'
import { DEFAULT_CHILDREN_KEY } from '../constants/index'
import { ensureArray } from '../utils/array'

export function depthFirst(
    tree: TreeNode | TreeNode[],
    callback: (node: TreeNode) => void,
    options: TreeOptions = {}
): void {
    const { childrenKey = DEFAULT_CHILDREN_KEY } = options
    const order = options.order === 'post' ? 'post' : 'pre'
    const nodes = ensureArray(tree)

    for (const node of nodes) {
        if (order === 'pre') callback(node)
        const children = node[childrenKey]
        if (children && Array.isArray(children)) {
            depthFirst(children, callback, options)
        }
        if (order === 'post') callback(node)
    }
}

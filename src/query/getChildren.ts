import { DEFAULT_CHILDREN_KEY } from '../constants'
import { find } from '../find/find'
import { BaseOptions, TreeNode } from '../types'

export function getChildren(
    tree: TreeNode | TreeNode[],
    predicate: (node: TreeNode) => boolean,
    options: BaseOptions = {}
): TreeNode[] {
    const { childrenKey = DEFAULT_CHILDREN_KEY } = options
    const node = find(tree, predicate, options)
    if (!node) return []
    const children = node[childrenKey]
    // 确保返回的是数组，且是原数组的副本（保证不可变性）
    return Array.isArray(children) ? [...children] : []
}
